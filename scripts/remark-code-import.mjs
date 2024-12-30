import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { visit } from 'unist-util-visit';

// <<< ./src/components/vue/VButton.vue
export function remarkCodePlugin() {
  return async function (tree, file) {
    visit(tree, (node) => {
      return node.type === 'text' && `${node.value}`.startsWith('<<<');
    }, (node, index, parent) => {
      const filePath = `${node.value}`.slice(4);
      const fileContent = readFileSync(join(cwd(), filePath));
      Object.assign(node, {
        type: 'element',
        tagName: 'details',
        children: [
          {
            type: 'element',
            tagName: 'summary',
            children: [{
              type: 'text',
              value: `${filePath}`,
            }],
          },
          {
            type: 'element',
            tagName: 'pre',
            properties: {
              class: 'astro-code github-dark',
              style: 'background-color:#24292e;color:#e1e4e8; overflow-x: auto;',
            },
            children: [
              {
                type: 'element',
                tagName: 'code',
                children: [{
                  type: 'text',
                  value: `${fileContent}`,
                }],
              },
            ],
          },
        ],
      });
    });
  };
}
