# Screenshots Directory

This directory contains screenshots for the project documentation.

## Required Screenshots for Module 13

1. **github-actions-success.png**: Screenshot of successful GitHub Actions workflow run showing:
   - All linting checks passing
   - Unit and integration tests passing
   - Playwright E2E tests passing
   - Docker build and push successful

2. **playwright-tests.png**: Screenshot of Playwright E2E tests execution showing:
   - All positive test cases passing
   - All negative test cases passing
   - Test summary with pass/fail counts

3. **login-page.png**: Screenshot of the login page showing:
   - Clean, professional UI design
   - Username/email and password fields
   - Login button
   - Link to registration page

4. **registration-page.png**: Screenshot of the registration page showing:
   - Username, email, password, and confirm password fields
   - Client-side validation hints
   - Register button
   - Link to login page

5. **dashboard-page.png**: Screenshot of authenticated dashboard showing:
   - User information display
   - Logout button
   - Protected content confirmation

6. **docker-hub.png**: Screenshot of Docker Hub repository showing:
   - Repository name
   - Latest tag and commit SHA tags
   - Automated build information

## How to Capture Screenshots

### GitHub Actions Screenshot
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select the latest successful workflow run
4. Capture full page screenshot showing all steps in green

### Playwright Tests Screenshot
```bash
pytest tests/e2e/ -v -m e2e
```
Capture terminal output showing all tests passing.

### Front-End Screenshots
1. Start the application: `uvicorn main:app --reload`
2. Open browser to `http://localhost:8000/static/register.html`
3. Capture screenshots of each page
4. For dashboard, login first to access protected route

### Docker Hub Screenshot
1. Login to hub.docker.com
2. Navigate to your repository
3. Capture screenshot showing tags and build information

## File Naming Convention

Use the exact filenames listed above for proper README integration.
