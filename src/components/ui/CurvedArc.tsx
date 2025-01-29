const CurvedArc = ({ className = "" }) => {
    return (
      <div className={`relative ${className}`}>
        <svg width="256" height="128" viewBox="0 0 256 128">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#E6F4F4', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#6AB2B4' }} />
            </linearGradient>
          </defs>
          <path
            d="M 0 128 A 128 128 0 0 1 256 128"
            stroke="url(#arcGradient)"
            strokeWidth="24"
            fill="none"
          />
        </svg>
      </div>
    );
  };
  
  export default CurvedArc;