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

from common.constants import enum

ApiErrorCodeEnumV2 = enum(
    SUCCESS=0,
    PARAM_NOT_VALID=1301100,
    CREATE_APP_ERROR=1301101,
    EDIT_APP_ERROR=1301102,
    ESB_NOT_VALID=1301103,
    APP_NOT_EXIST=1301104,
    NO_PERMISSION=1301105,
)
