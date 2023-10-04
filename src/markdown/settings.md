# How to configure the NPM plugin

Any type of package can be installed, as long as it is available on [unpkg.com](https://unpkg.com/). 

However, it's crucial to understand that not all loaded packages will be functional.

For the loaded library to be usable, it must be registered in the window. This import method is unique to each library, even though most libraries utilize this method.

After adding a library, you must specify the name of the instance it exposes. This allows weweb to establish a connection and incorporate it into the no-code interface.

In the example provided, the xlsx (or SheetJS) library can be accessed through the XLSX instance (in uppercase).

![Screenshot demonstrating access to the xlsx (or SheetJS) library through the uppercase XLSX instance.](https://docs.weweb.io/assets/npm2-bf06bf7b.png)

Most of the time, you'll find the instance name in the library documentation
