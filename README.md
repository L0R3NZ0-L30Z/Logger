# Simple Logger for the Esp32 chip

### Currently deployed [HERE](https://leguizard.vercel.app/)

#### This Logger takes SSE(SeverSideEvents) emited by the esp32 and presents them on a react web app.


### How to Set Up:

#### This logger wont work out of the box, you will have to make some adjustments due to chrome "secure" features.

- #### Enable 'Unsafe content' in Chrome:
    - #### For Mobile:
        - #### Click on this [LINK](chrome://flags/#unsafely-treat-insecure-origin-as-secure) and enable 'Insecure origins', then add the local IP of the Esp32 to the box.
        - #### Restart the browser.
    - #### For PC:
        - #### Click on the Lock in the top-left corner of the page, next to the searchbar, and go to settings.
        - #### On the settings tab scroll down until the 'Unsfe content' section, there select 'Allow'.
        - #### Reload the page.
