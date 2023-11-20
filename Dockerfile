# Use a base image that includes both Node.js and Python 3.10.11
FROM nikolaik/python-nodejs:python3.10-nodejs18

# Set the working directory
WORKDIR /app

# Copy Node.js dependencies files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Add node_modules/.bin to PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Set up a Python virtual environment
RUN python -m venv venv
ENV PATH="/app/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy your application code
COPY . .

# Expose the port your app runs on
EXPOSE 4500

# Command to run your app
CMD ["ts-node", "index.ts"]
