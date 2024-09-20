HOW TO SETUP THE PROJECT (with Angular 18) -

Open Github repository in any browser: https://github.com/barcoemu/tfn-launchpad-cr

Pre-requisites:
1. Install GIT on your machine.
2. Install git bash tool recommended for executing commands.
3. Install NodeJS version 20.17.0 (LTS).
4. Install Microsoft Visual Studio Code (latest version).
5. Install GitHub Desktop (latest version).

How to clone?
1. Open GitHub Desktop and go to current repository dropdown.
2. Click on Add and select "clone repository...".
3. In first tab, "GitHub.com", write the repository name "barcoemu/tfn-launchpad-cr".
4. Select repository and select local path where code will be checked out.
5. Click on clone.

After code is cloned to the specified location, GitHub Desktop will show your current repository and default branch as "develop".

Open VSCode editor and open launchpad-cr project folder.

Execute the following command to install all the required project dependencies:
> npm install

Undo removal of core-components in node_modules folder from VSCode Source control tab.

Execute the following command to start the application:
> npm start

Now open http://127.0.0.1:3000 to be able to launch the application.

To configure server goto "environment.ts" and look for server property.
To configure server proxy goto "proxy.conf.json" and look for target property.

How to run unit tests?

To run the application in test mode you will need to run the following command:
> npm test

To create the production bundle, execute the following command:
> npm run build

Above command will produce production ready bundle at following location:
    "\launchpad-cr\build\build\dist\collaboration-wall-manager\"


=========================================================================================================================
HOW TO GENERATE "CollaborationWallManager.war" LOCALLY:

Prerequisite:

		a) NodeJS version 20.17.0 (LTS) should be installed on the system.
		b) Install APACHE ANT, minimum version required(1.9.16) in "C:\Lang\apache-ant-1.9.16"
		c) Set system environment variable ANT_HOME=C:\Lang\apache-ant-1.9.16
		d) Add ANT_HOME variable in user environment variable PATH.

I.   Executing "build_new.xml" to generate WAR

     a) Run command "npm run build" to generate production ready bundle.
        The following folder will be created with the compiled code:
            "\launchpad-cr\build\build\dist\collaboration-wall-manager\"

     b) Copy the file "build_new.xml" from the project root at the folder location in step (a).
        Edit two lines in the file as follows:
            i.  <target name="build" depends="delete-war, create-war" />
            ii. <zipfileset dir="./" includes="**/**" excludes="build_new.xml, .svn, .js.map, .git"/>
        Remove the backup file created at the same location.

	 c) Open command prompt and go to location given in step (a).
        Execute the following command at the command prompt:
            ant -f build_new.xml
        This will generate CollaborationWallManager.war at the current location.

II.  Trouble shooting

	a) Execute cmd.exe as "Run as Administrator".
