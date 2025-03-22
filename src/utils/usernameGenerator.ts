export const generateUsername = (email:string) => {
    // Extract the part before the '@' in the email
    const baseUsername = email.split('@')[0];
  
    // Remove special characters and replace them with underscores
    const cleanedUsername = baseUsername.replace(/[^a-zA-Z0-9]/g, '_');
  
    // Append a random number to ensure uniqueness
    const randomSuffix = Math.floor(Math.random() * 1000);
  
    return `${cleanedUsername}_${randomSuffix}`;
  };