import grapesjs from 'grapesjs';
import juice from 'juice';
import { Types } from 'mongoose';
import { CAMPAIGN_API_URL } from '~/env';

function createUrl(url: string) {
  try {
    if (!url) {
      return url;
    }
    new URL(url);
    const redirectUrl = new URL(
      `${CAMPAIGN_API_URL}/api/v1/campaign/public/redirect`
    );
    redirectUrl.searchParams.append('next', url);
    return redirectUrl;
  } catch {
    return url;
  }
}

export const generateHTML = (projectData: string | object, to: string) => {
  const prasedData =
    typeof projectData === 'string' ? JSON.parse(projectData) : projectData;

  const editor = grapesjs.init({
    headless: true,
    projectData: prasedData,
  });

  const id = new Types.ObjectId();

  const trackingUrl = new URL(
    CAMPAIGN_API_URL + '/api/v1/campaign/public/track'
  );

  trackingUrl.searchParams.append('email', to);
  trackingUrl.searchParams.append('trackId', id.toString());

  const body = editor.getHtml({
    cleanId: true,
    attributes(component, attr) {
      if (component.get('type') === 'link') {
        const url = createUrl(attr['href']);
        if (typeof url === 'string') {
          return attr;
        }
        url.searchParams.append('email', to);
        url.searchParams.append('trackId', id.toString());
        attr['href'] = url.toString();
      }
      return attr;
    },
  });

  const css = editor.getCss();

  let html = `<!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                      ${css}
                    </style>
                  </head>
                  <!-- Tracking Pixel -->
                  <img src="${trackingUrl}" width="1" height="1" style="display:none;" />
                  ${body}
                </html>`;

  html = juice(html);

  return { html, id };
};
