import * as typedoc from 'typedoc';

export default function (PluginHost: typedoc.PluginHost) {
  const app = PluginHost.owner;

  app.renderer.on('beforeWriteDocument', (context: typedoc.Context) => {
    // Modify the navigation structure to group by classes, interfaces, and functions
    context.navigation.children = context.project.toObject().children
      .filter((child: any) => child.kindString === 'Class' || child.kindString === 'Interface' || child.kindString === 'Function')
      .map((child: any) => {
        return {
          title: child.name,
          url: child.url,
        };
      });
  });
}