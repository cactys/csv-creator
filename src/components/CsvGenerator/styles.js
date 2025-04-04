export const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
  },
  formGroup: {
    margin: '15px 0',
  },
  input: {
    marginLeft: '10px',
    padding: '5px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  hint: {
    fontSize: '0,8em',
    color: '#666',
    marginTop: '5px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'opacity 0.3s ease',
    ':disabled': {
      opacity: 0.8,
      cursor: 'default',
      backgroundColor: '#cccccc',
    },
  },
  error: {
    color: 'red',
    margin: '10px 0',
  },
  success: {
    color: 'green',
    margin: '10px 0',
  },
  statItem: {
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontSize: '0.9em',
    lineHeight: '1.5',
    border: '1px solid #dee2e6',
  },
  statsSection: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};
