const Scan = require('../models/Scan');
const fetch = require('node-fetch'); // Import node-fetch
const lookup = require('safe-browse-url-lookup')({ apiKey: process.env.GOOGLE_SAFE_BROWSING_API_KEY }); // Import and initialize Safe Browsing lookup
const psi = require('psi'); // Import the psi package
const mql = require('@microlink/mql'); // Import the microlink/mql package
const WhoisApi = require('whois-api-js'); // Import the whois-api-js package
const { IPinfoWrapper } = require('node-ipinfo'); // Import the node-ipinfo package
const dns = require('dns').promises; // Import the dns module for IP lookup

const whoisClient = new WhoisApi.Client(process.env.WHOISXML_API_KEY); // Initialize WHOIS API client
const ipinfoWrapper = new IPinfoWrapper(process.env.IPINFO_API_KEY); // Initialize IPinfo API client

// @desc    Create new scan
// @route   POST /api/scan
// @access  Private
const createScan = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'Please add a URL' });
  }

  // Basic URL validation (you might want to enhance this)
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  const issues = [];
  let pageSpeedInsightsData = null;
  let microlinkData = null; // Initialize microlinkData
  let whoisData = null; // Initialize whoisData
  let ipinfoData = null; // Initialize ipinfoData

  try {
    // Perform Google Safe Browsing API check
    const isMalicious = await lookup.checkSingle(url);

    if (isMalicious) {
        issues.push('URL flagged as unsafe by Google Safe Browsing');
    }

    // Perform Google PageSpeed Insights check (assuming psi package is installed)
    try {
      const { data } = await psi(url, { key: process.env.GOOGLE_SAFE_BROWSING_API_KEY }); // Use the same API key
      // Extract relevant data from the PageSpeed Insights response
      pageSpeedInsightsData = {}; // Initialize as an empty object

      if (data && data.lighthouseResult && data.lighthouseResult.categories) {
        pageSpeedInsightsData.performanceScore = data.lighthouseResult.categories.performance ? data.lighthouseResult.categories.performance.score * 100 : undefined;
        pageSpeedInsightsData.accessibilityScore = data.lighthouseResult.categories.accessibility ? data.lighthouseResult.categories.accessibility.score * 100 : undefined;
        pageSpeedInsightsData.bestPracticesScore = data.lighthouseResult.categories['best-practices'] ? data.lighthouseResult.categories['best-practices'].score * 100 : undefined;
        pageSpeedInsightsData.seoScore = data.lighthouseResult.categories.seo ? data.lighthouseResult.categories.seo.score * 100 : undefined;
      }

      if (data && data.lighthouseResult && data.lighthouseResult.audits) {
        pageSpeedInsightsData.fcp = data.lighthouseResult.audits['first-contentful-paint'] ? data.lighthouseResult.audits['first-contentful-paint'].displayValue : undefined;
        pageSpeedInsightsData.lcp = data.lighthouseResult.audits['largest-contentful-paint'] ? data.lighthouseResult.audits['largest-contentful-paint'].displayValue : undefined;
        pageSpeedInsightsData.cls = data.lighthouseResult.audits['cumulative-layout-shift'] ? data.lighthouseResult.audits['cumulative-layout-shift'].displayValue : undefined;
        pageSpeedInsightsData.tbt = data.lighthouseResult.audits['total-blocking-time'] ? data.lighthouseResult.audits['total-blocking-time'].displayValue : undefined;
        pageSpeedInsightsData.speedIndex = data.lighthouseResult.audits['speed-index'] ? data.lighthouseResult.audits['speed-index'].displayValue : undefined;
      }

    } catch (psiError) {
      console.error('PageSpeed Insights API error:', psiError);
      console.error('PageSpeed Insights API error response data:', psiError.response ? psiError.response.data : 'No response data'); // Log response data
      issues.push(`Error fetching PageSpeed Insights data: ${psiError.message}`);
    }

    // Perform Microlink API check (assuming @microlink/mql package is installed)
    try {
      const { data } = await mql(url); // Removed API key for free version
      microlinkData = {
        title: data.title,
        description: data.description,
        imageUrl: data.image ? data.image.url : undefined,
      };
    } catch (mqlError) {
      console.error('Microlink API error:', mqlError);
      issues.push(`Error fetching Microlink data: ${mqlError.message}`);
    }

    // Perform WHOIS lookup (assuming whois-api-js package is installed)
    try {
      const urlObject = new URL(url); // Re-parse URL to get hostname
      const hostname = urlObject.hostname;

      const whoisResponse = await whoisClient.get(hostname);

      // Extract relevant WHOIS data
      if (whoisResponse && whoisResponse.WhoisRecord) {
        const record = whoisResponse.WhoisRecord;
        whoisData = {
          domainName: record.domainName,
          registrarName: record.registrarRegistrationExpirationDate ? record.registrarName : undefined,
          creationDate: record.createdDate,
          expirationDate: record.expiresDate,
          domainAge: record.registryData && record.registryData.createdDateNormalized ?
                       Math.floor((new Date() - new Date(record.registryData.createdDateNormalized)) / (1000 * 60 * 60 * 24)) : undefined,
          status: record.status ? record.status.join(', ') : undefined,
        };
      } else {
          issues.push('WHOIS data not found for this domain.');
      }

    } catch (whoisError) {
      console.error('WHOIS API error:', whoisError);
      issues.push(`Error fetching WHOIS data: ${whoisError.message}`);
    }

    // Perform IPinfo lookup (assuming node-ipinfo package is installed and API key is set)
    try {
      const urlObject = new URL(url); // Re-parse URL to get hostname
      const hostname = urlObject.hostname;

      // Resolve hostname to IP address
      const { address } = await dns.lookup(hostname);

      const ipinfoResponse = await ipinfoWrapper.lookupIp(address);

      // Extract relevant IPinfo data
      if (ipinfoResponse) {
        ipinfoData = {
          ip: ipinfoResponse.ip,
          hostname: ipinfoResponse.hostname,
          city: ipinfoResponse.city,
          region: ipinfoResponse.region,
          country: ipinfoResponse.country,
          loc: ipinfoResponse.loc,
          org: ipinfoResponse.org,
          postal: ipinfoResponse.postal,
          timezone: ipinfoResponse.timezone,
        };
      } else {
        issues.push('IPinfo data not found for this IP address.');
      }

    } catch (ipinfoError) {
      console.error('IPinfo API error:', ipinfoError);
      issues.push(`Error fetching IPinfo data: ${ipinfoError.message}`);
    }

    // Create scan entry in database
    const scan = await Scan.create({
      user: req.user.id,
      url,
      issues,
      pageSpeedInsights: pageSpeedInsightsData,
      microlinkData: microlinkData,
      whoisData: whoisData,
      ipinfoData: ipinfoData,
    });
    res.status(201).json(scan);
  } catch (error) {
    console.error('Scan creation error:', error);
    res.status(500).json({ message: 'Error creating scan', error: error.message, stack: error.stack });
  }
};

// @desc    Get all scans for a user
// @route   GET /api/scans
// @access  Private
const getScans = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(scans);
  } catch (error) {
    console.error('Error fetching scans:', error);
    res.status(500).json({ message: 'Error fetching scans', error: error.message });
  }
};

// @desc    Get a single scan
// @route   GET /api/scans/:id
// @access  Private
const getScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    if (scan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(scan);
  } catch (error) {
    console.error('Error fetching scan:', error);
    res.status(500).json({ message: 'Error fetching scan', error: error.message });
  }
};

// @desc    Delete a scan
// @route   DELETE /api/scans/:id
// @access  Private
const deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    if (scan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await scan.deleteOne();
    res.json({ message: 'Scan removed' });
  } catch (error) {
    console.error('Error deleting scan:', error);
    res.status(500).json({ message: 'Error deleting scan', error: error.message });
  }
};

// @desc    Update a scan
// @route   PUT /api/scans/:id
// @access  Private
const updateScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    if (scan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update only the note field
    scan.note = req.body.note || scan.note;
    const updatedScan = await scan.save();
    res.json(updatedScan);
  } catch (error) {
    console.error('Error updating scan:', error);
    res.status(500).json({ message: 'Error updating scan', error: error.message });
  }
};

module.exports = {
  createScan,
  getScans,
  getScan,
  deleteScan,
  updateScan,
}; 