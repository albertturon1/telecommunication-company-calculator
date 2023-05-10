import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

const Theme = {
  colors: { ...fullConfig.theme?.colors } as Record<string, string>,
};

export default Theme;
