from decouple import Csv, config


def safe_csv(name, default=""):
    value = config(name, default=default, cast=Csv())
    return value if isinstance(value, (list, tuple)) else []
