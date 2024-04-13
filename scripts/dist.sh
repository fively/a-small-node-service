#!/bin/bash

if [ "$1" = "" ] ; then
    echo '未指定打包的项目，打包中断并退出!!'
    exit 1
fi

if [ "$1" != "all" ] ; then
    cross-env nest build $1
    exit 0
fi

ROOT_DIR=$(cd $(dirname $0);cd ..; pwd)
APPS_DIR=$(cd $ROOT_DIR; cd apps; pwd)

BUILD_COUNT=0
BUILD_TOTAL=$(echo $(ls -l $APPS_DIR |grep "^d"|wc -l))

read -p "本次打包共打包 $BUILD_TOTAL 个应用，是否继续？(y/n):" name

if [ "$name" != "y" -a "$name" != "Y" ] ; then
	echo '打包已取消！'
    exit 0
fi

echo -e "\n################################## 项目打包开始 ##################################\n"

dirs=$(ls -l $APPS_DIR |awk '/^d/ {print $NF}')

for d in $dirs
do
	BUILD_COUNT=`expr $BUILD_COUNT + 1`
	echo "#####  ("$BUILD_COUNT"/"$BUILD_TOTAL") $d 打包进行中..."
	cross-env nest build $d
	echo -e "#####  $d 打包已完成\n"
done

echo -e "###################### 打包已完成,本次共打包 $BUILD_COUNT 个应用 ######################\n"