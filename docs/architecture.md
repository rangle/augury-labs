# Augury Labs - Architecture

Augury Labs has a new architecture different from the architecture of the [Augury DevTools](https://github.com/rangle/augury),
with a modular, UI-agnostic design based on an event-driven core. We will be publishing more
in-depth documentation about this new architecture.

## How it Works

`@augury/core` maintains a set of `Probe`s, which [attach](https://stackoverflow.com/questions/5626193/what-is-monkey-patching)
themselves to various objects present in the application's context, for example: NgZone,
NgModule, the global Promise constructor, etc. Certain triggers from these `Probe`s will emit
events within `@augury/core`, which will synchronously react to the event before returning
control back to the application. Events can be consumed by `Plugin`s to provide different
types of metrics and interfaces. `Probe`s can also affect the object they are attached to,
allowing for `Plugin`s to offer interactive behavior.

To run your app under Augury Labs you should call the `auguryBootstrap` function exported by
`@augury/core`, passing your app module, your platform factory, the `NgZone` service, and an
array of Augury Labs plugin instances that you want to use:

```ts
auguryBootstrap({
  platform: platformBrowserDynamic,
  ngModule: AppModule,
  NgZone,
  plugins: [new PerformanceProfilerPlugin()],
});
```

Notice how the call to `auguryBootstrap` completely replaces the instatiation of
`platformBrowserDynamic` and subsequent `bootstrapModule` method call.
