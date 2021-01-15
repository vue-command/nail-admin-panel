export default {
  offline: {
    get: {
      error: true,
      errorType: 'Get offline courses',
      errorMessage: 'Process failed... Data was not received',
    },
    get_by_id: {
      error: true,
      errorType: 'Get offline course',
      errorMessage: 'Process failed. Data was not received',
    },
    post: {
      error: true,
      errorType: 'Create offline course',
      errorMessage: 'Process failed. Data was not received',
    },
    put: {
      error: true,
      errorType: 'Edit offline course',
      errorMessage: 'Process failed... Data was not saved',
    },
    delete: {
      error: true,
      errorType: 'Delete offline course',
      errorMessage: 'Process failed....',
    },
  },

  online: {
    get: {
      error: true,
      errorType: 'Get online courses',
      errorMessage: 'Process failed. Data was not received',
    },
    get_by_id: {
      error: true,
      errorType: 'Get online course',
      errorMessage: 'Process failed. Data was not received',
    },
    get_video: {
      error: true,
      errorType: 'Get online course video',
      errorMessage: 'Process failed. Data was not received',
    },
    publish: {
      error: true,
      errorType: 'Publish course',
      errorMessage: 'Publishing course error',
    },
  },

};