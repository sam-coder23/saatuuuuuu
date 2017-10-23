How to generate generate CrisisRoomUI.war -

Following files are needed to achive this -
files: "build_new.xml"
This is placed at the root of the project

Step 1 -
Install NodeJS version 4.5.0 in "C:\Lang\nodejs".

Step 2 -
Install APACHE ANT, minimum version required(1.8.0) in "C:\Lang\apache-ant-1.8.0"

Step 3 -
Set system environment variable ANT_HOME=C:\Lang\apache-ant-1.8.0

Step 4 -
Add ANT_HOME  variable in user environment variable PATH.

Step 5 -
Set system environment variable LAUNCHPAD_PATH = <Sandbox>\Subsystems\CMS\JavaScript\Codebase\Launchpad\

Step 6 -
Take latest updated code. Launch cmd.exe and go to  location "<Sandbox>\Subsystems\CMS\JavaScript\Codebase\Launchpad\" of branch "TFN_LAUNCHPAD".

Step 7 -
Execute folllwing at command prompt
ant -f build_new.xml
This will generate WebUI.war at the root of the project

How to trouble shoot incase something does not work -
execute cmd.exe as "Run as Administrator" to see detailed error
