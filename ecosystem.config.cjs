module.exports = {
  apps: [
    {
      name: 'frontend-migration-vue',
      cwd: './apps/vue',
      script: '../../node_modules/vite/bin/vite.js',
      args: 'preview --host 127.0.0.1 --port 4173 --strictPort',
      interpreter: 'node'
    },
    {
      name: 'frontend-migration-react',
      cwd: './apps/react',
      script: '../../node_modules/vite/bin/vite.js',
      args: 'preview --host 127.0.0.1 --port 4174 --strictPort',
      interpreter: 'node'
    }
  ]
}
