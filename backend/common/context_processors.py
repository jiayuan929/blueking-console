# -*- coding: utf-8 -*-
"""
TencentBlueKing is pleased to support the open source community by making
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

context_processor for common(setting)
** 除setting外的其他context_processor内容，均采用组件的方式(string)
"""
from django.conf import settings
from django.utils import timezone


def site_settings(request):
    return {
        "LOGIN_URL": settings.LOGIN_URL,
        "LOGOUT_URL": settings.LOGOUT_URL,
        "STATIC_URL": settings.STATIC_URL,
        "SITE_URL": settings.SITE_URL,
        "STATIC_VERSION": settings.STATIC_VERSION,
        "APP_PATH": request.get_full_path(),
        "NOW": timezone.now(),
        # 本地 js 后缀名
        "JS_SUFFIX": settings.JS_SUFFIX,
        # 本地 css 后缀名
        "CSS_SUFFIX": settings.CSS_SUFFIX,
        "EXTERNAL_THEME": settings.EXTERNAL_THEME,
        # PaaS3.0 的访问地址
        "BK_PAAS3_URL": settings.BK_PAAS3_URL,
        "BK_USER_APP_CODE": settings.BK_USER_APP_CODE,
        "BK_DOCS_URL_PREFIX": settings.BK_DOCS_URL_PREFIX,
        "IS_BK_NOTICE_ENABLED": settings.IS_BK_NOTICE_ENABLED,
    }
