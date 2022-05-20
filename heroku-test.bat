cd c:\code\LobesLab\git_lobeslab\lobeslab-saqsini-test-heroku
del *
rmdir /Q /S assets
rmdir /Q /S components
rmdir /Q /S layouts
rmdir /Q /S middleware
rmdir /Q /S pages
rmdir /Q /S plugins
rmdir /Q /S services
rmdir /Q /S static
rmdir /Q /S store

xcopy ..\com.lobeslab.saqsini\* .\
xcopy ..\com.lobeslab.saqsini\assets .\assets\ /E
xcopy ..\com.lobeslab.saqsini\components .\components\ /E
xcopy ..\com.lobeslab.saqsini\layouts .\layouts\ /E
xcopy ..\com.lobeslab.saqsini\middleware .\middleware\ /E
xcopy ..\com.lobeslab.saqsini\pages .\pages\ /E
xcopy ..\com.lobeslab.saqsini\plugins .\plugins\ /E
xcopy ..\com.lobeslab.saqsini\services .\services\ /E
xcopy ..\com.lobeslab.saqsini\static .\static\ /E
xcopy ..\com.lobeslab.saqsini\store .\store\ /E
