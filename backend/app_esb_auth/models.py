# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making
蓝鲸智云 - 蓝鲸桌面 (BlueKing - bkconsole) available.
Copyright (C) 2022 THL A29 Limited,
a Tencent company. All rights reserved.
Licensed under the MIT License (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the License for the
specific language governing permissions and limitations under the License.

We undertake not to change the open source license (MIT license) applicable

to the current version of the project delivered to anyone in the future.
"""
from builtins import object

from django.db import models
from django.utils import timezone

from common.constants import APPROVAL_RESULT_CHOICE


class EsbAuthApplyReocrd(models.Model):
    """
    组件权限申请记录
    """

    operator = models.CharField(u"申请人", max_length=32)
    app_code = models.CharField(u"申请的应用", max_length=32)
    sys_name = models.CharField(u"组件系统名称", max_length=128)
    api_id = models.IntegerField(u"组件系统API ID")
    api_name = models.CharField(u"组件系统API名称", max_length=128)
    create_time = models.DateTimeField(u"创建时间", auto_now_add=True, blank=True, null=True)

    approver = models.CharField(u"审批人", max_length=32, blank=True, null=True)
    approval_result = models.CharField(u"审批结果", max_length=32, choices=APPROVAL_RESULT_CHOICE, default="applying")
    approval_time = models.DateTimeField(u"审批时间", null=True, blank=True)

    class Meta(object):
        verbose_name = u"app组件申请记录表"
        verbose_name_plural = u"app组件申请记录表"
        db_table = "paas_app_esb_auth_apply_record"
        app_label = "app_esb_auth"

    def __unicode__(self):
        return "%s(%s)" % (self.operator, self.app_code)

    @property
    def create_time_display(self):
        if not self.create_time:
            return self.create_time
        return timezone.localtime(self.create_time).strftime("%Y-%m-%d %H:%M:%S")

    @property
    def approval_time_display(self):
        if not self.approval_time:
            return self.approval_time
        return timezone.localtime(self.approval_time).strftime("%Y-%m-%d %H:%M:%S")
