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
    base: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    },
    disabled: {
      opacity: 0.8,
      cursor: 'default',
      backgroundColor: '#a5d6a7',
      ':hover': {
        transform: 'none',
        boxShadow: 'none',
      },
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
