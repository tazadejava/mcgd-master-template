#!/bin/bash

groupNumber=$1
level=$2


pluginTerm=PluginLevel$level
pluginFolder=../../../StudentPlugins/Group$groupNumber/TeamPlugin
jarName=TeamPlugin

downloadedFilesFolder=../userFiles/group$groupNumber

verifierPath=../../../PluginVerifier.jar

echo "Removing old .java files from plugin folder ${groupNumber}..."

cd $pluginFolder/src/main/java || { echo "Directory failure! (0)"; exit 1; }

rm -f *.java

#first must copy over the updated files to the plugin folder
echo "Copying .java files to plugin folder..."

cd - || { echo "Directory failure! (1)"; exit 1; }
cd $downloadedFilesFolder || { echo "Directory failure! (1)"; exit 1; }

find . -name '*.java' -exec cp \{\} $pluginFolder/src/main/java \;

#remove userfiles from userFiles directory
cd - || { echo "Directory failure! (1)"; exit 1; }
cd $downloadedFilesFolder || { echo "Directory failure! (2)"; exit 1; }
rm -f *.java

cd - || { echo "Directory failure! (1)"; exit 1; }
cd $pluginFolder || { echo "Directory failure! (3)"; exit 1; }

#transfer class files if needed
transferFolder=../../../StudentPlugins/Transfer/level$level/

if [ -d "$transferFolder" ]; then
  echo "Transfer files exist! Transferring to the plugin..."
  cp -a $transferFolder/. $pluginFolder/src/main/java/
fi

#compile maven
echo "Compiling plugin: ${pluginFolder}..."
output=$(mvn package)

case $output in
  *"BUILD SUCCESS"*)
    echo "Verifying that the code's logic fits all constraints..."
    verificationOutput=$(java -jar $verifierPath $level $pluginFolder)
    
    case $verificationOutput in
      *"VERIFICATION SUCCESS"*)
        #TRANSFER TO GROUP SERVER HERE. YOU MUST CHANGE THIS TO WHERE YOUR SERVER IS, EITHER SCP OR CP
        scp -i id_rsa $pluginFolder/target/$jarName.jar steve@mcgd-s$groupNumber.xvm.mit.edu:/home/steve/server/plugins/$jarName.jar
        echo "BUILD AND VERIFICATION SUCCESS!"
        ;;
      *)
        echo "${verificationOutput}"
        echo "THE VERIFICATION FAILED!"
        echo "Please make sure that you are following the proper constraints for the level. If you are stuck, ask us for help!"
        ;;
    esac
    ;;
  *)
    echo "${output}"
    echo "COMPILATION FAILED!"
    echo "Please double check your code for compilation errors (ex: typo, didn't import package, etc). If you are stuck, ask us for help!"
    ;;
esac
