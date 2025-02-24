import grapesjs from 'grapesjs';

export const validateFromString = (projectData: string) => {
  try {
    const editor = grapesjs.init({
      headless: true,
      projectData: JSON.parse(projectData),
    });
    if (!editor.getHtml().trim) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
