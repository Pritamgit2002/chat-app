export const removePrefix = (sessionName: string) => {
    const prefix = "Chat Session about ";
    return sessionName.startsWith(prefix)
      ? sessionName.slice(prefix.length)
      : sessionName;
};