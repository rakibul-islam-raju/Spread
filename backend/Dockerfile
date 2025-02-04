# official imagge
FROM python:3.12

# set workdir
WORKDIR /app

# copy dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy app files
COPY . .

# expose port
EXPOSE 8000

# run gunicorn server
CMD [ "gunicorn", "--bind", '0.0.0.0:8000', 'core.asgi:application' ]