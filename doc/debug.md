# Steps to debug

Some assets are not included in this repository. To try the examples, install them in the following steps:

1. Download the following asset and put it to `debug/assets/downloads`:

    - `Alicia_VRM.zip` from [ニコニ立体ちゃん (VRM)](https://3d.nicovideo.jp/works/td32797)
    - `2447165450261591383.vrm` from [千駄ヶ谷 渋 - VRoid Hub](https://hub.vroid.com/characters/675572020956181239/models/4479743608263344465)

2. Unzip the archive file:

    ```sh
    unzip -d debug/assets/ debug/assets/downloads/Alicia_VRM.zip
    mkdir -p debug/assets/Shibu && cp debug/assets/downloads/2447165450261591383.vrm debug/assets/Shibu/shibu_sendagaya.vrm
    ```

3. Install dependencies:

    ```sh
    npm install
    ```

4. Start the dev server:

    ```sh
    npm run debug
    ```

5. Open <http://localhost:8080/debug/>.
