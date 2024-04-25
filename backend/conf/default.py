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

Django settings for console project.

Generated by 'django-admin startproject' using Django 1.8.17.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import sys

from django.utils.functional import SimpleLazyObject

try:
    import pymysql

    pymysql.version_info = (1, 4, 2, "final", 0)
    pymysql.install_as_MySQLdb()
except Exception:
    pass

PROJECT_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT, PROJECT_MODULE_NAME = os.path.split(PROJECT_PATH)
BASE_DIR = os.path.dirname(os.path.dirname(PROJECT_PATH))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/
APP_ID = "bk_paas"
PAAS_APP_ID = "bk_paas"
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "u39(-@%)6qf1&(d8i!1x_fpzb@n4dgbzkd6y-2bqxdj0f&l^3w"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

# csrf 相关
CSRF_COOKIE_NAME = "bk_csrftoken"
# CSRF 验证失败处理函数
CSRF_FAILURE_VIEW = "account.views.csrf_failure"

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_prometheus",
    "django_tags",
    "account",
    "bk_i18n",
    "app",
    "app_env",
    "release",
    "engine",
    "saas",
    "desktop",
    "analysis",
    "api",
    "app_esb_auth",
    "user_center",
    "audit",
    "esb.bkcore",
]

MIDDLEWARE = [
    "django_prometheus.middleware.PrometheusBeforeMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "account.middlewares.LoginMiddleware",
    "bk_i18n.middlewares.LanguageMiddleware",
    "bk_i18n.middlewares.TimezoneMiddleware",
    "common.middlewares.CheckXssMiddleware",
    "django_prometheus.middleware.PrometheusAfterMiddleware",
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# https://docs.djangoproject.com/zh-hans/3.2/ref/clickjacking/
X_FRAME_OPTIONS = 'SAMEORIGIN'

ROOT_URLCONF = "urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(PROJECT_ROOT, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.csrf",
                # 自定义模版context，可以在页面中使用STATIC_URL等变量
                "common.context_processors.site_settings",
                "django.template.context_processors.i18n",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/
SITE_URL = "/console/"

STATIC_URL = SITE_URL + "static/"

STATIC_ROOT = os.path.join(PROJECT_ROOT, "static_files")

STATICFILES_DIRS = (os.path.join(PROJECT_ROOT, "static"),)


STATIC_VERSION = "0.2.16"

MEDIA_ROOT = os.path.join(PROJECT_ROOT, "media")
MEDIA_URL = "/media/"

# CSS 文件后缀名
CSS_SUFFIX = "min.css"
# JS 文件后缀名
JS_SUFFIX = "min.js"

# 自定义主题
EXTERNAL_THEME = ""

##################
# AUTHENTICATION #
##################

LOGIN_URL = "/accounts/login/"

LOGOUT_URL = "/accounts/logout/"

LOGIN_REDIRECT_URL = SITE_URL

AUTH_USER_MODEL = "account.BkUser"

AUTHENTICATION_BACKENDS = ("account.backends.BkBackend", "django.contrib.auth.backends.ModelBackend")

REDIRECT_FIELD_NAME = "c_url"

LOGIN_DOMAIN = ""

# cookie名称
BK_COOKIE_NAME = "bk_token"
# cookie 有效期，默认为1天
BK_COOKIE_AGE = 60 * 60 * 24

WSGI_APPLICATION = "wsgi.application"


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/
# TIME_ZONE = 'Etc/GMT%+d' % ((time.altzone if time.daylight else time.timezone) / 3600)
USE_I18N = True
USE_L10N = True

# Default time zone for localization in the UI.
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
TIME_ZONE = "Asia/Shanghai"
USE_TZ = True
TIMEZONE_SESSION_KEY = "django_timezone"

# language
# 避免循环引用
_ = lambda s: s  # noqa
LANGUAGES = (
    ("en", _(u"English")),
    ("zh-hans", _(u"简体中文")),
)
LANGUAGE_CODE = "zh-hans"
LANGUAGE_COOKIE_DOMAIN = SimpleLazyObject(
    lambda: getattr(getattr(sys.modules["django.conf"], "settings"), "BK_COOKIE_DOMAIN")
)
LANGUAGE_COOKIE_NAME = "blueking_language"
LANGUAGE_COOKIE_PATH = "/"
LOCALE_PATHS = (os.path.join(PROJECT_ROOT, "locale"),)


##################
# 应用访问链接 #
##################
APP_TEST_URL = SimpleLazyObject(
    lambda: "%s://%s/t/{app_code}/"
    % (
        getattr(getattr(sys.modules["django.conf"], "settings"), "HTTP_SCHEMA"),
        getattr(getattr(sys.modules["django.conf"], "settings"), "PAAS_DOMAIN"),
    )
)
APP_PROD_URL = SimpleLazyObject(
    lambda: "%s://%s/o/{app_code}/"
    % (
        getattr(getattr(sys.modules["django.conf"], "settings"), "HTTP_SCHEMA"),
        getattr(getattr(sys.modules["django.conf"], "settings"), "PAAS_DOMAIN"),
    )
)

##################
# 第三方应用链接 #
##################
HOST_CC = ""
HOST_JOB = ""
# PaaS3.0 的访问地址
BK_PAAS3_URL = ""
# 用户管理使用的 bk_app_code
BK_USER_APP_CODE = "bk_user_manage"
# 用户管理访问地址
BK_USER_URL = ""

# 是否展示产品版本信息
IS_BK_SUITE_ENABLED = True

# 是否接入权限中心
IS_IAM_ENABLED = True

# HTTP CONNECTIONS
REQUESTS_POOL_CONNECTIONS = 20
REQUESTS_POOL_MAXSIZE = 20

# 默认数据库AUTO字段类型
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

# 是否开启评分功能
IS_APP_STAR_ENABLED = False

# 通知中心的功能可通过配置开启
IS_BK_NOTICE_ENABLED = False
BK_NOTICE_ENV = "prod"

##################
# 企业证书校验相关 #
##################
IS_CERTIFICATE_SVC_ENABLED = True
CLIENT_CERT_FILE_PATH = SimpleLazyObject(
    lambda: os.path.join(getattr(getattr(sys.modules["django.conf"], "settings"), "CERTIFICATE_DIR"), "platform.cert")
)
CLIENT_KEY_FILE_PATH = SimpleLazyObject(
    lambda: os.path.join(getattr(getattr(sys.modules["django.conf"], "settings"), "CERTIFICATE_DIR"), "platform.key")
)
CERTIFICATE_SERVER_URL = SimpleLazyObject(
    lambda: "https://%s/certificate"
    % getattr(getattr(sys.modules["django.conf"], "settings"), "CERTIFICATE_SERVER_DOMAIN")
)

# 证书过期前提前多少天弹出提示
LICENSE_AHEAD_NOTICE_DAYS = 365

# cache config
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "TIMEOUT": 30,
        "OPTIONS": {"MAX_ENTRIES": 1000},
    }
}

# logging config
LOGGER_LEVEL = "INFO"

LOGGING_DIR = os.environ.get("PAAS_LOGGING_DIR") or os.path.join(os.path.dirname(BASE_DIR), "logs")
if not os.path.exists(LOGGING_DIR):
    os.mkdir(LOGGING_DIR)

# 10M
LOG_MAX_BYTES = 1024 * 1024 * 10
LOG_BACKUP_COUNT = 10
LOG_CLASS = "logging.handlers.RotatingFileHandler"
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s [%(asctime)s] %(pathname)s %(lineno)d %(funcName)s %(process)d %(thread)d \n \t %(message)s \n",  # noqa
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "simple": {"format": "%(levelname)s %(message)s \n"},
    },
    "handlers": {
        "null": {
            "level": "DEBUG",
            "class": "logging.NullHandler",
        },
        "mail_admins": {"level": "ERROR", "class": "django.utils.log.AdminEmailHandler"},
        "console": {"level": "DEBUG", "class": "logging.StreamHandler", "formatter": "simple"},
        "root": {
            "class": LOG_CLASS,
            "formatter": "verbose",
            "filename": os.path.join(LOGGING_DIR, "console.log"),
            "maxBytes": LOG_MAX_BYTES,
            "backupCount": LOG_BACKUP_COUNT,
        },
        "wb_mysql": {
            "class": LOG_CLASS,
            "formatter": "verbose",
            "filename": os.path.join(LOGGING_DIR, "console_mysql.log"),
            "maxBytes": LOG_MAX_BYTES,
            "backupCount": LOG_BACKUP_COUNT,
        },
        "iam": {
            "class": LOG_CLASS,
            "formatter": "verbose",
            "filename": os.path.join(LOGGING_DIR, "console_iam.log"),
            "maxBytes": LOG_MAX_BYTES,
            "backupCount": LOG_BACKUP_COUNT,
        },
    },
    "loggers": {
        "django": {
            "handlers": ["null"],
            "level": "ERROR",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": True,
        },
        "root": {
            "handlers": ["root"],
            "level": LOGGER_LEVEL,
            "propagate": True,
        },
        "django.db.backends": {
            "handlers": ["wb_mysql"],
            "level": "ERROR",
            "propagate": True,
        },
        "iam": {
            "handlers": ["iam"],
            "level": LOGGER_LEVEL,
            "propagate": True,
        },
    },
}
