import React, { useState } from 'react';
import './ScanCard.css';

function ScanCard({ scan, onDelete, onUpdateNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(scan.note || '');

  const handleUpdateClick = () => {
    if (isEditing) {
      onUpdateNote(scan._id, note);
    }
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = () => {
    onDelete(scan._id);
  };

  return (
    <div className="scan-card">
      <h3>URL: {scan.url}</h3>
      <p>Timestamp: {new Date(scan.createdAt).toLocaleString()}</p>

      {/* Display Microlink Data */}
      {scan.microlinkData && (
        <div>
          <h4>Website Metadata (Microlink):</h4>
          {scan.microlinkData.title && <p>Title: {scan.microlinkData.title}</p>}
          {scan.microlinkData.description && <p>Description: {scan.microlinkData.description}</p>}
          {scan.microlinkData.imageUrl && (
            <img src={scan.microlinkData.imageUrl} alt="Website preview" className="scan-result-image" />
          )}
          {/* Add other microlinkData fields here if needed */}
        </div>
      )}

      {/* Display WHOIS Data */}
      {scan.whoisData && (
        <div className="whois-section">
          <h4>WHOIS Information:</h4>
          {scan.whoisData.domainName && <p>Domain Name: {scan.whoisData.domainName}</p>}
          {scan.whoisData.registrarName && <p>Registrar: {scan.whoisData.registrarName}</p>}
          {scan.whoisData.creationDate && <p>Creation Date: {new Date(scan.whoisData.creationDate).toLocaleDateString()}</p>}
          {scan.whoisData.expirationDate && <p>Expiration Date: {new Date(scan.whoisData.expirationDate).toLocaleDateString()}</p>}
          {scan.whoisData.domainAge !== undefined && <p>Domain Age: {scan.whoisData.domainAge} days</p>}
          {scan.whoisData.status && <p>Status: {scan.whoisData.status}</p>}
          {/* Add other whoisData fields here if needed */}
        </div>
      )}

      {/* Display IPinfo Data */}
      {scan.ipinfoData && (
        <div className="ipinfo-section">
          <h4>IP Information (IPinfo):</h4>
          {scan.ipinfoData.ip && <p>IP Address: {scan.ipinfoData.ip}</p>}
          {scan.ipinfoData.hostname && <p>Hostname: {scan.ipinfoData.hostname}</p>}
          {scan.ipinfoData.city && <p>City: {scan.ipinfoData.city}</p>}
          {scan.ipinfoData.region && <p>Region: {scan.ipinfoData.region}</p>}
          {scan.ipinfoData.country && <p>Country: {scan.ipinfoData.country}</p>}
          {scan.ipinfoData.loc && <p>Location (lat, lon): {scan.ipinfoData.loc}</p>}
          {scan.ipinfoData.org && <p>Organization: {scan.ipinfoData.org}</p>}
          {scan.ipinfoData.postal && <p>Postal Code: {scan.ipinfoData.postal}</p>}
          {scan.ipinfoData.timezone && <p>Timezone: {scan.ipinfoData.timezone}</p>}
          {/* Add other ipinfoData fields here if needed */}
        </div>
      )}

      {/* Display Gemini Explanation
      {scan.geminiExplanation && (
        <div className="gemini-explanation-section" style={{ border: '1px solid #4285F4', padding: '10px', marginBottom: '10px', backgroundColor: '#e8f0fe' }}>
          <h4>Gemini Summary:</h4>
          <p>{scan.geminiExplanation}</p>
        </div>
      )} */}

      {/* Display PageSpeed Insights Data */}
      {scan.pageSpeedInsights && (
        <div className="pagespeed-section">
          <h4>PageSpeed Insights:</h4>
          <p>Performance: {scan.pageSpeedInsights.performanceScore !== undefined ? `${scan.pageSpeedInsights.performanceScore}/100` : 'N/A'}</p>
          <p>Accessibility: {scan.pageSpeedInsights.accessibilityScore !== undefined ? `${scan.pageSpeedInsights.accessibilityScore}/100` : 'N/A'}</p>
          <p>Best Practices: {scan.pageSpeedInsights.bestPracticesScore !== undefined ? `${scan.pageSpeedInsights.bestPracticesScore}/100` : 'N/A'}</p>
          <p>SEO: {scan.pageSpeedInsights.seoScore !== undefined ? `${scan.pageSpeedInsights.seoScore}/100` : 'N/A'}</p>
          <h5>Core Web Vitals:</h5>
          <ul>
            <li>FCP: {scan.pageSpeedInsights.fcp || 'N/A'}</li>
            <li>LCP: {scan.pageSpeedInsights.lcp || 'N/A'}</li>
            <li>CLS: {scan.pageSpeedInsights.cls || 'N/A'}</li>
            <li>TBT: {scan.pageSpeedInsights.tbt || 'N/A'}</li>
            <li>Speed Index: {scan.pageSpeedInsights.speedIndex || 'N/A'}</li>
          </ul>
        </div>
      )}
      <div className="issues-section">
        <h4>Issues Found:</h4>
        {scan.issues && scan.issues.length > 0 ? (
          <ul>
            {scan.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        ) : (
          <p>No issues found.</p>
        )}
      </div>
      <div>
        <h4>Note:</h4>
        {isEditing ? (
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        ) : (
          <p>{scan.note || 'Add a note...'}</p>
        )}
      </div>
      <div className="scan-actions">
        <button onClick={handleUpdateClick}>
          {isEditing ? 'Save Note' : 'Edit Note'}
        </button>
        <button onClick={handleDeleteClick}>Delete Scan</button>
      </div>
    </div>
  );
}

export default ScanCard; 