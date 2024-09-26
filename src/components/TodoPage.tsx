/**
 * @todo YOU HAVE TO IMPLEMENT THE SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 * @todo THERE ARE ALSO FEW BUGS, FIX THEM
 */
import { Check, Delete,Edit } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {

  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [ editingTaskId, setEditingTaskId ] = useState<number | null>(null)



  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    try{
      await api.delete(`/tasks/${id}`);
      await handleFetchTasks();
    }catch(err){
      console.error('Failed to delete task:', err);
    }
  }

  const handlePost = async () => {
    try{
      const data = {name : newTask}
      console.log('Sending task data:', data);
      await api.post('/tasks', data);
      setNewTask("")
      await handleFetchTasks();
    }catch (err){console.error('Failed to delete task:', err);}
  }

  const handleEditClick =(id:number)=>{
    setEditingTaskId(id)
  };

  const handleUpdate = async(id:number, iditTask: string)=>{
    try{
      await api.patch(`/tasks/${id}`,{name : iditTask});
      setEditingTaskId(null);
      await handleFetchTasks();

    }catch(err){
      console.error('Failed to delete task:', err);
    }
  }

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box display="flex" justifyContent="center" key={task.id} alignItems="center" mt={2} gap={1} width="100%">
              <TextField size="small" value={task.name}  fullWidth sx={{ maxWidth: 350 }}
                          onChange={(e)=>{
                            if(editingTaskId === task.id){
                              const updatedTasks = tasks.map((t) => (t.id === task.id ? { ...t, name: e.target.value } : t));
                              setTasks(updatedTasks);
                            }
                          }}/>
              <Box>
                <IconButton color="success"  onClick={() => handleUpdate(task.id, task.name)}>
                  <Check />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleEditClick(task.id)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={()=> handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>

            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" gap={1} alignItems="center" mt={2}>
          <Button variant="outlined" onClick={handlePost} disabled={!newTask.trim()}>Ajouter une tâche</Button>
          <TextField size="small" placeholder="...."
                     fullWidth sx={{ maxWidth: 250 }}
                      value = {newTask}
                      onChange={(e)=>setNewTask(e.target.value)}/>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
