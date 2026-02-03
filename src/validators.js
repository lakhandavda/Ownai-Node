function isEmail(e) {
  return typeof e === 'string' && /\S+@\S+\.\S+/.test(e);
}

export async function runValidation(obj) {
  if (!obj) throw new Error('Invalid payload');
  if (!obj.name) throw new Error('Name is required');
  if (!obj.email || !isEmail(obj.email)) throw new Error('Valid email is required');
  if (!obj.password || String(obj.password).length < 6) throw new Error('Password must be at least 6 characters');
  if (obj.role && !['Admin', 'Staff'].includes(obj.role)) throw new Error('Role must be Admin or Staff');
}
