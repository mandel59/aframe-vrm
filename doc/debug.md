# Steps to debug

Some assets are not included in this repository. To try the examples, install them in the following steps:

1. Download the following asset and put it to `debug/assets/`:

    - `Alicia_VRM.zip` from [ニコニ立体ちゃん (VRM)](https://3d.nicovideo.jp/works/td32797)

2. Unzip the archive file:

    ```sh
    unzip -d debug/assets/ debug/assets/Alicia_VRM.zip
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
