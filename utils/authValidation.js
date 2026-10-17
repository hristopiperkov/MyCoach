export function validateRegister(values) {
  if (!values.first_name.trim() || !values.last_name.trim()) return "Enter your first and last name.";
  if (!values.email.trim()) return "Enter your email address.";
  if (values.password.length < 8) return "Use a password with at least 8 characters.";
  if (values.password !== values.confirmPassword) return "The passwords do not match.";
  if (!["Client", "Coach"].includes(values.role)) return "Choose Client or Coach.";
  if (values.img_url.trim()) {
    try {
      const url = new URL(values.img_url.trim());
      if (!["https:", "http:"].includes(url.protocol)) return "Use an http or https image URL.";
    } catch { return "Enter a valid image URL."; }
  }
  return "";
}
