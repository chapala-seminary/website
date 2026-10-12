#!/usr/bin/env python3
"""Validate either French packet format; exit nonzero when validation fails."""
import runpy
from pathlib import Path

if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).parent / 'tools' / 'validate.py'), run_name='__main__')
