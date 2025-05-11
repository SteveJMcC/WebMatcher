
export function maskEmail(email?: string | null): string {
  if (!email || email.trim() === "" || email.indexOf('@') === -1 || email === "No email provided" || email === "No email") {
    return "Email not available";
  }
  const [localPart, domainPart] = email.split('@');
  if (localPart.length <= 3) {
    return `${localPart[0]}**@${domainPart}`;
  }
  return `${localPart.substring(0, 3)}***@${domainPart}`;
}

export function maskPhone(phone?: string | null): string {
  if (!phone || phone.trim() === "" || phone === "No phone provided" || phone === "No phone") {
    return "Phone not available";
  }
  
  // Preserve non-digit characters and mask digits except the last 4
  let masked = "";
  let digitCounter = 0;
  const totalDigitsInPhone = phone.replace(/\D/g, "").length;

  if (totalDigitsInPhone <= 4) {
    return phone; // Not enough digits to mask meaningfully
  }

  for (let i = 0; i < phone.length; i++) {
    const char = phone[i];
    if (/\d/.test(char)) {
      digitCounter++;
      if (digitCounter > totalDigitsInPhone - 4) {
        masked += char; // Keep last 4 digits
      } else {
        masked += "X"; // Mask other digits
      }
    } else {
      masked += char; // Keep non-digit characters (e.g., +, (, ), -)
    }
  }
  return masked;
}
