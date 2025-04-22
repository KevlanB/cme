FROM python:3.12.3

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y curl && \
    curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /usr/local/bin/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

RUN pip install pytest

ENV PYTHONPATH=/app

CMD ["wait-for-it.sh", "db:5432", "--", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
