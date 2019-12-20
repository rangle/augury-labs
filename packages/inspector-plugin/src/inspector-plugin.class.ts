import { Bridge, ComponentTreeInfoProjection, DirectBridgeConnection, Plugin } from '@augury/core';

import { InspectorController } from './inspector-controller.class';

export class InspectorPlugin extends Plugin {
  private controller = new InspectorController();

  public doInitialize() {
    const connection = new DirectBridgeConnection();
    const bridge = new Bridge(connection);

    this.controller.window.auguryBridge = bridge;

    this.getAugury().registerEventProjection(new ComponentTreeInfoProjection(), treeInfo =>
      bridge.send({
        type: 'component-tree',
        payload: treeInfo,
      }),
    );
  }
}
