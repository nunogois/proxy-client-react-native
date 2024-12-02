# proxy-client-react-native

# DEPRECATED

This repository is no longer maintained. Please use [unleash-react-native](https://github.com/nunogois/unleash-react-native) instead.

# Introduction

PoC for a React Native / Expo SDK for [Unleash](https://www.getunleash.io/) based on the official [proxy-client-react](https://github.com/Unleash/proxy-client-react).

You can check an example/demo here: [proxy-client-react-native-demo](https://github.com/nunogois/proxy-client-react-native-demo).

This should be very similar to [proxy-client-react](https://github.com/unleash/proxy-client-react) but with any specific React Native / Expo caveats built-in, providing more of a plug and play experience for end-users.

See: [unleash-proxy-client-js #87](https://github.com/Unleash/unleash-proxy-client-js/issues/87).

# DISCLAIMER:

This library is meant to be used with the [unleash-proxy](https://github.com/Unleash/unleash-proxy). The proxy application layer will sit between your unleash instance and your client applications, and provides performance and security benefits. DO NOT TRY to connect this library directly to the unleash instance, as the datasets follow different formats because the proxy only returns evaluated toggle information.

# Installation

```bash
npm install @nunogois/proxy-client-react-native unleash-proxy-client
// or
yarn add @nunogois/proxy-client-react-native unleash-proxy-client
```

# Initialization

Import the provider like this in your entrypoint file (typically index.js/ts):

```jsx
import { createRoot } from 'react-dom/client';
import { FlagProvider } from '@nunogois/proxy-client-react-native';

const config = {
  url: 'https://HOSTNAME/proxy',
  clientKey: 'PROXYKEY',
  refreshInterval: 15,
  appName: 'your-app-name',
  environment: 'dev',
};

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <FlagProvider config={config}>
      <App />
    </FlagProvider>
  </React.StrictMode>
);
```

Alternatively, you can pass your own client in to the FlagProvider:

```jsx
import { createRoot } from 'react-dom/client';
import { FlagProvider, UnleashClient, defaultStorageProvider } from '@nunogois/proxy-client-react-native';

const config = {
  url: 'https://HOSTNAME/proxy',
  clientKey: 'PROXYKEY',
  refreshInterval: 15,
  appName: 'your-app-name',
  environment: 'dev',
  storageProvider: defaultStorageProvider()
};

const client = new UnleashClient(config);
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <FlagProvider unleashClient={client}>
      <App />
    </FlagProvider>
  </React.StrictMode>
);
```

## Deferring client start

By default, the Unleash client will start polling the Proxy for toggles immediately when the `FlagProvider` component renders. You can delay the polling by:
- setting the `startClient` prop to `false`
- passing a client instance to the `FlagProvider`

```jsx
root.render(
  <React.StrictMode>
    <FlagProvider unleashClient={client} startClient={false}>
      <App />
    </FlagProvider>
  </React.StrictMode>
);
```

Deferring the client start gives you more fine-grained control over when to start fetching the feature toggle configuration. This could be handy in cases where you need to get some other context data from the server before fetching toggles, for instance.

To start the client, use the client's `start` method. The below snippet of pseudocode will defer polling until the end of the `asyncProcess` function.

``` jsx
const client = new UnleashClient({ /* ... */ })

useEffect(() => {
  const asyncProcess = async () => {
	// do async work ...
	client.start()
    }
    asyncProcess()
  }, [])

return (
  // Pass client as `unleashClient` and set `startClient` to `false`
  <FlagProvider unleashClient={client} startClient={false}>
    <App />
  </FlagProvider>
)
```

# Usage

## Check feature toggle status

To check if a feature is enabled:

```jsx
import { useFlag } from '@nunogois/proxy-client-react-native';

const TestComponent = () => {
  const enabled = useFlag('travel.landing');

  if (enabled) {
    return <SomeComponent />
  }
  return <AnotherComponent />
};

export default TestComponent;
```

## Check variants

To check variants:

```jsx
import { useVariant } from '@nunogois/proxy-client-react-native';

const TestComponent = () => {
  const variant = useVariant('travel.landing');

  if (variant.enabled && variant.name === "SomeComponent") {
    return <SomeComponent />
  } else if (variant.enabled && variant.name === "AnotherComponent") {
    return <AnotherComponent />
  }
  return <DefaultComponent />
};

export default TestComponent;
```

## Defer rendering until flags fetched

useFlagsStatus retrieves the ready state and error events.
Follow the following steps in order to delay rendering until the flags have been fetched.

```jsx
import { useFlagsStatus } from '@nunogois/proxy-client-react-native'

const MyApp = () => {
  const { flagsReady, flagsError } = useFlagsStatus();

  if (!flagsReady) {
    return <Loading />
  }
  return <MyComponent error={flagsError}/>
}

```

## Updating context

Follow the following steps in order to update the unleash context:

```jsx
import { useUnleashContext, useFlag } from '@nunogois/proxy-client-react-native'

const MyComponent = ({ userId }) => {
  const variant = useFlag("my-toggle");
  const updateContext = useUnleashContext();

  useEffect(() => {
    // context is updated with userId
    updateContext({ userId })
  }, [userId])

  useEffect(() => {
    async function run() {
    // Can wait for the new flags to pull in from the different context
      await updateContext({ userId });
      console.log('new flags loaded for', userId);
    }
    run();
  }, [userId]);
}

```

## Use unleash client directly

```jsx
import { useUnleashContext, useUnleashClient } from '@nunogois/proxy-client-react-native'

const MyComponent = ({ userId }) => {
  const client = useUnleashClient();

  const updateContext = useUnleashContext();

  const login = () => {
    // login user
    if (client.isEnabled("new-onboarding")) {
      // Send user to new onboarding flow
    } else (
      // send user to old onboarding flow
    )
  }

  return <LoginForm login={login}/>
}
```

## Usage with class components
Since this library uses hooks you have to implement a wrapper to use with class components. Beneath you can find an example of how to use this library with class components, using a custom wrapper:

```jsx
import React from "react";
import {
  useFlag,
  useUnleashClient,
  useUnleashContext,
  useVariant,
  useFlagsStatus
} from "@nunogois/proxy-client-react-native";

interface IUnleashClassFlagProvider {
  render: (props: any) => React.ReactNode;
  flagName: string;
}

export const UnleashClassFlagProvider = ({
  render,
  flagName
}: IUnleashClassFlagProvider) => {
  const enabled = useFlag(flagName);
  const variant = useVariant(flagName);
  const client = useUnleashClient();

  const { updateContext } = useUnleashContext();
  const { flagsReady, flagsError } = useFlagsStatus();

  const isEnabled = () => {
    return enabled;
  };

  const getVariant = () => {
    return variant;
  };

  const getClient = () => {
    return client;
  };

  const getUnleashContextSetter = () => {
    return updateContext;
  };

  const getFlagsStatus = () => {
    return { flagsReady, flagsError };
  };

  return (
    <>
      {render({
        isEnabled,
        getVariant,
        getClient,
        getUnleashContextSetter,
        getFlagsStatus
      })}
    </>
  );
};
```

Wrap your components like so: 
```jsx
    <UnleashClassFlagProvider
      flagName="demoApp.step1"
      render={({ isEnabled, getClient }) => (
        <MyClassComponent isEnabled={isEnabled} getClient={getClient} />
      )}
    />
```
