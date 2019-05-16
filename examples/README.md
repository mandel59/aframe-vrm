# Steps to run examples

Some assets are not included in this repository. To try the examples, install them in the following steps:

1. Download the following asset and put it to `examples/assets/`:

    - `Alicia_VRM.zip` from [ニコニ立体ちゃん (VRM)](https://3d.nicovideo.jp/works/td32797)

2. Unzip the archive file:

    ```sh
    unzip -d examples/assets/ examples/assets/Alicia_VRM.zip
    ```

3. Install dependencies then build:

    ```sh
    npm install && npm run build
    ```

4. Run:

    ```sh
    npm run example
    ```