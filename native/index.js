//#!/usr/bin/env node

/**
 *  该模块完成包括 Android 原生开发的项目初始化工作
 *  By Roubo
 */
const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
// 目前支持的功能组件数量
const compSuports = 2;


const entry = (name, describe, author) => {
  console.log(symbols.success, '----------------------------------------------------');
  console.log(symbols.success, '进入 Native 类型配置进程');
  console.log(symbols.success, '----------------------------------------------------');

  inquirer.prompt([
    {
      name: 'languageType',
      message: '选择使用的编程语言，目前支持 Java/Kotlin: '
    },
    {
      name: 'constructType',
      message: '选择使用的编程结构，目前支持 MVC/MVP/MVVM: '
    },
    {
      name: 'uiType',
      message:
        '----------------------------------------------------\n' +
        chalk.blue('   选择一种 UI 结构风格 \n') +
        '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
        '   [0]一个空的 Activity\n' +
        '   [1]微信风格\n' +
        '   [2]今日头条风格\n' +
        '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
        ' ----------------------------------------------------\n' +
        ': '
    },
    {
      name: 'compList',
      message:
        '----------------------------------------------------\n' +
        chalk.blue('   选择需要加入的功能组件 （多选时用 "," 分隔, 比如： "0,1"）\n') +
        '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
        '   [0] 支付功能，包括支付宝和微信支付\n' +
        '   [1] 分享功能，包括微信分享、微博分享\n' +
        '   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
        ' ----------------------------------------------------\n' +
        ': '
    },
  ]).then((answers) => {
    // input 有效性检查
    if(['Java', 'Kotlin'].indexOf(answers.languageType) === -1)  {
      console.log(symbols.error, chalk.red('语言选择出错，请重试！'))
    }
    if(['MVC', 'MVP', 'MVVM'].indexOf(answers.constructType) === -1)  {
      console.log(symbols.error, chalk.red('编程结构选择出错，请重试！'))
    }
    if(['0', '1', '2'].indexOf(answers.uiType) === -1)  {
      console.log(symbols.error, chalk.red('UI结构选择出错，请重试！'))
    }
    if(answers.compList.split(',').length === 0) {
      console.log(symbols.error, chalk.red('功能组件选择出错，请重试！'))
    }
    if(answers.compList.split(',').length !== 0) {
      answers.compList.split(',').forEach((value) => {
        if(parseInt(value) > compSuports - 1) {
          console.log(symbols.error, chalk.red('功能组件选择出错，请重试！'))
        }
      })
    }

    // 根据输入，确认下载的模板分支
    const templateJson = JSON.parse(fs.readFileSync('./native/templates.json'));
    const branch = templateJson['Android'][answers.languageType][answers.uiType][answers.constructType]['branch'];

    // 开始下载模板
    if(branch !== '') {
      const spinner = ora('下载模板 ...');
      spinner.start();
      download('flipxfx/download-git-repo-fixture#' + branch, name, {clone: true}, (err) => {
        if(err) {
          spinner.fail();
          console.log(symbols.error, chalk.red(err));
        } else {
          spinner.succeed();
        }
      });

    }

  })
}

const native = {
  entry
};

module.exports = native;

