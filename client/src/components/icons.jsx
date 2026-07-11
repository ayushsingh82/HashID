import React from 'react';

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Svg = ({ size = 28, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
    {children}
  </svg>
);

export const IconTarget = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconChain = (props) => (
  <Svg {...props}>
    <rect x="3" y="9" width="8" height="8" rx="2.5" />
    <rect x="13" y="7" width="8" height="8" rx="2.5" />
    <path d="M9 13h6" />
  </Svg>
);

export const IconDocument = (props) => (
  <Svg {...props}>
    <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
    <path d="M14 3.5V8h4" />
    <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18h4" />
  </Svg>
);

export const IconBolt = (props) => (
  <Svg {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
  </Svg>
);

export const IconSearch = (props) => (
  <Svg {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.8-4.8" />
  </Svg>
);

export const IconNetwork = (props) => (
  <Svg {...props}>
    <circle cx="5.5" cy="6" r="2.5" />
    <circle cx="18.5" cy="6" r="2.5" />
    <circle cx="12" cy="18" r="2.5" />
    <path d="M7.7 7.3 10 16M16.3 7.3 14 16M8 6h8" />
  </Svg>
);

export const IconCheck = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M7.5 12.5l3 3 6-6.5" />
  </Svg>
);

export const IconWarning = (props) => (
  <Svg {...props}>
    <path d="M12 3.5 21.5 20h-19L12 3.5z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconCross = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </Svg>
);

export const IconUpload = (props) => (
  <Svg {...props}>
    <path d="M12 15.5V4.5M8 8.5 12 4.5l4 4" />
    <path d="M5 15.5v3a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-3" />
  </Svg>
);

export const IconCopy = (props) => (
  <Svg {...props}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v7.5A1.5 1.5 0 0 0 6 15h2.5" />
  </Svg>
);

export const IconCheckSmall = (props) => (
  <Svg {...props}>
    <path d="M5 12.5 9.5 17 19 6.5" />
  </Svg>
);

/** Brand mark: a minted seal with a verification check — used for the logo and favicon. */
export const LogoMark = ({ size = 32, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" {...rest}>
    <circle cx="16" cy="16" r="15" fill="#16a34a" />
    <circle
      cx="16"
      cy="16"
      r="15"
      fill="none"
      stroke="#ffffff"
      strokeOpacity="0.4"
      strokeWidth="1.3"
      strokeDasharray="0.4 3.6"
      strokeLinecap="round"
    />
    <path
      d="M10.5 16.6l3.6 3.6 7.4-8.4"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
