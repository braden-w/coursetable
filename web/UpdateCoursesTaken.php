<?php
require_once 'includes/ProjectCommon.php';

$netId = ProjectCommon::getID();

$smarty = ProjectCommon::createSmarty();

$smarty->display('UpdateCoursesTaken.tpl');
