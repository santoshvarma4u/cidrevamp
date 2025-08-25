// Placeholder utilities for missing assets during Docker builds

export function createLogoPlaceholder(text: string, width = 120, height = 80): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1" rx="4"/>
      <text x="${width/2}" y="${height/2}" text-anchor="middle" dominant-baseline="middle" 
            font-family="Arial, sans-serif" font-size="10" fill="#6B7280" font-weight="600">
        ${text}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function createPersonPlaceholder(name = "Officer", width = 128, height = 160): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#F3F4F6"/>
      <path d="M${width/2} ${height*0.5}C${width*0.55} ${height*0.5} ${width*0.6} ${height*0.46} ${width*0.6} ${height*0.41}C${width*0.6} ${height*0.36} ${width*0.55} ${height*0.32} ${width/2} ${height*0.32}C${width*0.45} ${height*0.32} ${width*0.4} ${height*0.36} ${width*0.4} ${height*0.41}C${width*0.4} ${height*0.46} ${width*0.45} ${height*0.5} ${width/2} ${height*0.5}ZM${width/2} ${height*0.5}C${width*0.28} ${height*0.5} ${width*0.28} ${height*0.6} ${width*0.28} ${height*0.67}H${width*0.72}C${width*0.72} ${height*0.6} ${width*0.72} ${height*0.5} ${width*0.72} ${height*0.5}H${width/2}Z" fill="#9B9BAB"/>
      <text x="${width/2}" y="${height*0.87}" text-anchor="middle" font-family="Arial" font-size="10" fill="#9B9BAB">${name}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Common logo placeholders
export const LOGO_PLACEHOLDERS = {
  bprd: createLogoPlaceholder("BPRD"),
  cbi: createLogoPlaceholder("CBI"),
  cyberDost: createLogoPlaceholder("Cyber Dost"),
  cybercrime: createLogoPlaceholder("Cybercrime"),
  mha: createLogoPlaceholder("MHA"),
  ncb: createLogoPlaceholder("NCB"),
  nia: createLogoPlaceholder("NIA"),
  ncrb: createLogoPlaceholder("NCRB"),
  svpnpa: createLogoPlaceholder("SVPNPA"),
  westBengalCid: createLogoPlaceholder("WB CID"),
  jkCid: createLogoPlaceholder("J&K CID"),
  maharastraCid: createLogoPlaceholder("MH CID"),
  mizoramCid: createLogoPlaceholder("MZ CID"),
  odishaCid: createLogoPlaceholder("OR CID"),
  telanganaStatePolice: createLogoPlaceholder("TS Police"),
  telanganaGov: createLogoPlaceholder("TS Govt"),
  cyberabadPolice: createLogoPlaceholder("Cyberabad"),
  hydPolice: createLogoPlaceholder("HYD Police"),
  generic: createLogoPlaceholder("Logo"),
  policeShield: createLogoPlaceholder("Police", 80, 80),
};