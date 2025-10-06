"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  company: string;
  department: string;
  phone_number?: string;
  employment_type?: string;
  hire_date?: string;
  manager: string;
}

interface Task {
  task_id: number;
  employee_id: number;
  project: string;
  task_title: string;
  task_description: string;
  priority: string;
  start_date: string;
  due_date: string;
  status: string;
  progress_percent: number;
  expected_mins: number;
  realized_mins: number;
  employees: {
    first_name: string;
    last_name: string;
    company: string;
  };
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [hoveredTheme, setHoveredTheme] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedDueDate, setSelectedDueDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const [taskForm, setTaskForm] = useState({
    employee_id: '',
    project: '',
    task_title: '',
    task_description: '',
    priority: 'Medium',
    start_date: '',
    due_date: '',
    status: 'Not Started',
    progress_percent: 0,
    expected_mins: '',
  });

  const [editTaskForm, setEditTaskForm] = useState({
    employee_id: '',
    project: '',
    task_title: '',
    task_description: '',
    priority: 'Medium',
    start_date: '',
    due_date: '',
    status: 'Not Started',
    progress_percent: 0,
    expected_mins: '',
    realized_mins: '',
  });

  const [employeeForm, setEmployeeForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: 'Trainer',
    department: 'Training',
    company: 'L4Y',
    manager: 'Ahmet Ateş',
    employment_type: 'Full-Time',
    hire_date: '',
  });

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (employee) {
      loadData();
    }
  }, [employee]);

  useEffect(() => {
    applyFilters();
  }, [tasks, selectedCompany, selectedEmployee, selectedProject, selectedTaskId, selectedDueDate, selectedStatus]);

  const initializeUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/';
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*, employees(*)')
        .eq('auth_uid', user.id)
        .single();

      if (!profile) {
        const { data: employeeData } = await supabase
          .from('employees')
          .select('*')
          .eq('email', user.email)
          .single();

        if (employeeData) {
          await supabase
            .from('user_profiles')
            .insert({
              auth_uid: user.id,
              email: user.email,
              employee_id: employeeData.employee_id
            });

          setEmployee(employeeData);
        }
      } else {
        setEmployee(profile.employees);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      window.location.href = '/';
    }
  };

  const loadData = async () => {
    if (!employee) return;

    setIsLoading(true);
    try {
      let tasksQuery = supabase
        .from('tasks')
        .select(`
          *,
          employees!inner(first_name, last_name, company)
        `)
        .neq('status', 'Completed')
        .order('due_date', { ascending: true });

      if (employee.role === 'Super-Admin' || employee.role === 'Super-Manager') {
      } else if (employee.role === 'Admin' || employee.role === 'Manager') {
        tasksQuery = tasksQuery.eq('employees.company', employee.company);
      } else {
        tasksQuery = tasksQuery.eq('employee_id', employee.employee_id);
      }

      const { data: tasksData, error: tasksError } = await tasksQuery;

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

      if (employee.role === 'Super-Admin' || employee.role === 'Super-Manager') {
        setCompanies(['L4Y', 'MAT', 'ArtWN', 'AAN']);
        
        const { data: employeesData } = await supabase
          .from('employees')
          .select('*')
          .order('first_name');
        setEmployees(employeesData || []);

        setProjects(['L4Y Project', 'MAT Project', 'ArtWN Project', 'EU BigData Project']);
      } else if (employee.role === 'Admin' || employee.role === 'Manager') {
        setCompanies([employee.company]);
        
        const { data: employeesData } = await supabase
          .from('employees')
          .select('*')
          .eq('company', employee.company)
          .order('first_name');
        setEmployees(employeesData || []);

        const projectMap: { [key: string]: string[] } = {
          'L4Y': ['L4Y Project'],
          'MAT': ['MAT Project'],
          'ArtWN': ['ArtWN Project'],
          'AAN': ['EU BigData Project']
        };
        setProjects(projectMap[employee.company] || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (selectedCompany) {
      filtered = filtered.filter(task => task.employees.company === selectedCompany);
    }

    if (selectedEmployee) {
      filtered = filtered.filter(task => task.employee_id === parseInt(selectedEmployee));
    }

    if (selectedProject) {
      filtered = filtered.filter(task => task.project === selectedProject);
    }

    if (selectedTaskId) {
      filtered = filtered.filter(task => task.task_id === parseInt(selectedTaskId));
    }

    if (selectedDueDate) {
      filtered = filtered.filter(task => task.due_date === selectedDueDate);
    }

    if (selectedStatus) {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          employee_id: parseInt(taskForm.employee_id),
          project: taskForm.project,
          task_title: taskForm.task_title,
          task_description: taskForm.task_description,
          priority: taskForm.priority,
          start_date: taskForm.start_date,
          due_date: taskForm.due_date,
          status: taskForm.status,
          progress_percent: taskForm.progress_percent,
          expected_mins: parseInt(taskForm.expected_mins),
        }]);

      if (error) throw error;

      setShowTaskModal(false);
      setTaskForm({
        employee_id: '',
        project: '',
        task_title: '',
        task_description: '',
        priority: 'Medium',
        start_date: '',
        due_date: '',
        status: 'Not Started',
        progress_percent: 0,
        expected_mins: '',
      });
      
      loadData();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskForm({
      employee_id: task.employee_id.toString(),
      project: task.project,
      task_title: task.task_title,
      task_description: task.task_description,
      priority: task.priority,
      start_date: task.start_date,
      due_date: task.due_date,
      status: task.status,
      progress_percent: task.progress_percent,
      expected_mins: task.expected_mins.toString(),
      realized_mins: task.realized_mins?.toString() || '',
    });
    setShowEditTaskModal(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          employee_id: parseInt(editTaskForm.employee_id),
          project: editTaskForm.project,
          task_title: editTaskForm.task_title,
          task_description: editTaskForm.task_description,
          priority: editTaskForm.priority,
          start_date: editTaskForm.start_date,
          due_date: editTaskForm.due_date,
          status: editTaskForm.status,
          progress_percent: editTaskForm.progress_percent,
          expected_mins: parseInt(editTaskForm.expected_mins),
          realized_mins: editTaskForm.realized_mins ? parseInt(editTaskForm.realized_mins) : null,
        })
        .eq('task_id', editingTask.task_id);

      if (error) throw error;

      setShowEditTaskModal(false);
      setEditingTask(null);
      loadData();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', taskId);

      if (error) throw error;

      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const handleCreateEmployee = async () => {
    try {
      const { error } = await supabase
        .from('employees')
        .insert([{
          first_name: employeeForm.first_name,
          last_name: employeeForm.last_name,
          email: employeeForm.email,
          phone_number: employeeForm.phone_number,
          role: employeeForm.role,
          department: employeeForm.department,
          company: employeeForm.company,
          manager: employeeForm.manager,
          employment_type: employeeForm.employment_type,
          hire_date: employeeForm.hire_date,
          status: 'Active',
        }]);

      if (error) throw error;

      setShowEmployeeModal(false);
      setEmployeeForm({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role: 'Trainer',
        department: 'Training',
        company: 'L4Y',
        manager: 'Ahmet Ateş',
        employment_type: 'Full-Time',
        hire_date: '',
      });
      
      loadData();
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const canEditTask = () => {
    return ['Super-Admin', 'Super-Manager', 'Admin', 'Manager'].includes(employee?.role || '');
  };

  const canDeleteTask = () => {
    return employee?.role === 'Super-Admin';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return darkMode ? 'bg-red-500/20 text-red-900' : 'bg-red-100 text-red-700';
      case 'Medium': return darkMode ? 'bg-yellow-500/20 text-yellow-900' : 'bg-yellow-100 text-yellow-700';
      case 'Low': return darkMode ? 'bg-green-500/20 text-green-900' : 'bg-green-100 text-green-700';
      default: return darkMode ? 'bg-gray-500/20 text-gray-900' : 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return darkMode ? 'bg-gray-500/20 text-gray-900' : 'bg-gray-100 text-gray-700';
      case 'In Progress': return darkMode ? 'bg-blue-500/20 text-blue-900' : 'bg-blue-100 text-blue-700';
      case 'Delayed': return darkMode ? 'bg-red-500/20 text-red-900' : 'bg-red-100 text-red-700';
      default: return darkMode ? 'bg-gray-500/20 text-gray-900' : 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-orange-500' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-2xl font-light text-black">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${darkMode ? 'bg-orange-500' : 'bg-gray-50'} p-8`}>
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-5xl font-light mb-2 tracking-tight ${darkMode ? 'text-black' : 'text-black'}`}>
              SocialGen
            </h1>
            <p className={`text-lg ${darkMode ? 'text-black' : 'text-gray-600'}`}>
              Welcome, {employee?.first_name} {employee?.last_name} ({employee?.role})
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              onMouseEnter={() => setHoveredTheme(true)}
              onMouseLeave={() => setHoveredTheme(false)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                darkMode 
                  ? hoveredTheme ? 'text-white' : 'text-black'
                  : hoveredTheme ? 'text-orange-500' : 'text-black'
              }`}
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            
            <button
              onClick={handleLogout}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                darkMode
                  ? 'bg-black text-white hover:bg-zinc-800'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {(employee?.role === 'Super-Admin' || employee?.role === 'Admin' || employee?.role === 'Manager') && (
        <div className="max-w-7xl mx-auto mb-8 flex gap-4">
          <button
            onClick={() => setShowTaskModal(true)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              darkMode
                ? 'bg-black text-white hover:bg-zinc-800'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            + Create Task
          </button>
          
          {employee?.role === 'Super-Admin' && (
            <button
              onClick={() => setShowEmployeeModal(true)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                darkMode
                  ? 'bg-black text-white hover:bg-zinc-800'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              + Create Employee
            </button>
          )}
        </div>
      )}

      {(employee?.role === 'Super-Admin' || employee?.role === 'Super-Manager' || employee?.role === 'Admin' || employee?.role === 'Manager') && (
        <div className={`max-w-7xl mx-auto mb-8 rounded-2xl p-6 border-2 ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`}>
          <h2 className={`text-2xl font-light mb-4 ${darkMode ? 'text-black' : 'text-black'}`}>Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(employee?.role === 'Super-Admin' || employee?.role === 'Super-Manager') && (
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                  Company
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                    darkMode 
                      ? 'bg-orange-400 border-black text-black focus:border-white focus:text-white' 
                      : 'bg-white border-black text-black focus:border-orange-500'
                  } focus:outline-none`}
                >
                  <option value="">All Companies</option>
                  {companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                  darkMode 
                    ? 'bg-orange-400 border-black text-black focus:border-white focus:text-white' 
                    : 'bg-white border-black text-black focus:border-orange-500'
                } focus:outline-none`}
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                  darkMode 
                    ? 'bg-orange-400 border-black text-black focus:border-white focus:text-white' 
                    : 'bg-white border-black text-black focus:border-orange-500'
                } focus:outline-none`}
              >
                <option value="">All Projects</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                Task ID
              </label>
              <input
                type="number"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                placeholder="Enter task ID"
                className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                  darkMode 
                    ? 'bg-orange-400 border-black text-black focus:border-white focus:text-white placeholder-gray-600' 
                    : 'bg-white border-black text-black focus:border-orange-500 placeholder-gray-400'
                } focus:outline-none`}
              />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                Due Date
              </label>
              <input
                type="date"
                value={selectedDueDate}
                onChange={(e) => setSelectedDueDate(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                  darkMode 
                    ? 'bg-orange-400 border-black text-black focus:border-white focus:text-white' 
                    : 'bg-white border-black text-black focus:border-orange-500'
                } focus:outline-none`}
              />
            </div>

            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl transition-all border-2 ${
                  darkMode 
                    ? 'bg-orange-400 border-black text-black focus:border-white focus:text-white' 
                    : 'bg-white border-black text-black focus:border-orange-500'
                } focus:outline-none`}
              >
                <option value="">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCompany('');
              setSelectedEmployee('');
              setSelectedProject('');
              setSelectedTaskId('');
              setSelectedDueDate('');
              setSelectedStatus('');
            }}
            className={`mt-4 px-6 py-3 rounded-xl font-medium transition-all ${
              darkMode
                ? 'bg-black text-white hover:bg-zinc-800'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h2 className={`text-3xl font-light mb-6 ${darkMode ? 'text-black' : 'text-black'}`}>
          Tasks ({filteredTasks.length})
        </h2>
        
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={`rounded-2xl p-8 border-2 text-center ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`}>
              <p className={`text-lg ${darkMode ? 'text-black' : 'text-gray-600'}`}>
                No tasks found
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.task_id}
                className={`rounded-2xl p-6 border-2 ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'} hover:shadow-lg transition-all`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-medium mb-1 ${darkMode ? 'text-black' : 'text-black'}`}>
                      {task.task_title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-black' : 'text-gray-600'}`}>
                      Task ID: #{task.task_id} | {task.employees.first_name} {task.employees.last_name} | {task.employees.company}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                {task.task_description && (
                  <p className={`mb-4 ${darkMode ? 'text-black' : 'text-gray-700'}`}>
                    {task.task_description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-black' : 'text-gray-500'} mb-1`}>Project</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-black' : 'text-black'}`}>{task.project}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-black' : 'text-gray-500'} mb-1`}>Start Date</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-black' : 'text-black'}`}>
                      {task.start_date ? new Date(task.start_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-black' : 'text-gray-500'} mb-1`}>Due Date</p>
                    <p className={`text-sm font-medium ${darkMode ? 'text-black' : 'text-black'}`}>
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-black' : 'text-gray-500'} mb-1`}>Progress</p>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 h-2 rounded-full ${darkMode ? 'bg-orange-400' : 'bg-gray-200'}`}>
                        <div
                          className={`h-full rounded-full ${darkMode ? 'bg-black' : 'bg-orange-500'}`}
                          style={{ width: `${task.progress_percent}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-black' : 'text-black'}`}>
                        {task.progress_percent}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className={darkMode ? 'text-black' : 'text-gray-600'}>Expected: </span>
                      <span className={`font-medium ${darkMode ? 'text-black' : 'text-black'}`}>
                        {task.expected_mins ? `${task.expected_mins} mins` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className={darkMode ? 'text-black' : 'text-gray-600'}>Realized: </span>
                      <span className={`font-medium ${darkMode ? 'text-black' : 'text-black'}`}>
                        {task.realized_mins ? `${task.realized_mins} mins` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {canEditTask() && (
                      <button
                        onClick={() => handleEditTask(task)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          darkMode
                            ? 'bg-black text-white hover:bg-zinc-800'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteTask() && (
                      <button
                        onClick={() => handleDeleteTask(task.task_id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          darkMode
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowTaskModal(false)}>
          <div className={`rounded-2xl p-8 border-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`} onClick={(e) => e.stopPropagation()}>
            <h2 className={`text-3xl font-light mb-6 ${darkMode ? 'text-black' : 'text-black'}`}>Create New Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Assign To</label>
                <select value={taskForm.employee_id} onChange={(e) => setTaskForm({...taskForm, employee_id: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required>
                  <option value="">Select Employee</option>
                  {employees.map(emp => (<option key={emp.employee_id} value={emp.employee_id}>{emp.first_name} {emp.last_name}</option>))}
                </select>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Project</label>
                <select value={taskForm.project} onChange={(e) => setTaskForm({...taskForm, project: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required>
                  <option value="">Select Project</option>
                  {projects.map(project => (<option key={project} value={project}>{project}</option>))}
                </select>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Task Title</label>
                <input type="text" value={taskForm.task_title} onChange={(e) => setTaskForm({...taskForm, task_title: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required />
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Description</label>
                <textarea value={taskForm.task_description} onChange={(e) => setTaskForm({...taskForm, task_description: e.target.value})} rows={3} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Priority</label>
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Status</label>
                  <select value={taskForm.status} onChange={(e) => setTaskForm({...taskForm, status: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Start Date</label>
                  <input type="date" value={taskForm.start_date} onChange={(e) => setTaskForm({...taskForm, start_date: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Due Date</label>
                  <input type="date" value={taskForm.due_date} onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required />
                </div>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Expected Time (minutes)</label>
                <input type="number" value={taskForm.expected_mins} onChange={(e) => setTaskForm({...taskForm, expected_mins: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} min="0" />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={handleCreateTask} className={`flex-1 py-3 rounded-xl font-medium ${darkMode ? 'bg-black text-white hover:bg-zinc-800' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>Create Task</button>
                <button onClick={() => setShowTaskModal(false)} className={`flex-1 py-3 rounded-xl font-medium border-2 ${darkMode ? 'border-black text-black hover:bg-orange-400' : 'border-black text-black hover:bg-gray-100'}`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowEditTaskModal(false)}>
          <div className={`rounded-2xl p-8 border-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`} onClick={(e) => e.stopPropagation()}>
            <h2 className={`text-3xl font-light mb-6 ${darkMode ? 'text-black' : 'text-black'}`}>Edit Task #{editingTask.task_id}</h2>
            <div className="space-y-4">
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Assign To</label>
                <select value={editTaskForm.employee_id} onChange={(e) => setEditTaskForm({...editTaskForm, employee_id: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required>
                  <option value="">Select Employee</option>
                  {employees.map(emp => (<option key={emp.employee_id} value={emp.employee_id}>{emp.first_name} {emp.last_name}</option>))}
                </select>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Project</label>
                <select value={editTaskForm.project} onChange={(e) => setEditTaskForm({...editTaskForm, project: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required>
                  <option value="">Select Project</option>
                  {projects.map(project => (<option key={project} value={project}>{project}</option>))}
                </select>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Task Title</label>
                <input type="text" value={editTaskForm.task_title} onChange={(e) => setEditTaskForm({...editTaskForm, task_title: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required />
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Description</label>
                <textarea value={editTaskForm.task_description} onChange={(e) => setEditTaskForm({...editTaskForm, task_description: e.target.value})} rows={3} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Priority</label>
                  <select value={editTaskForm.priority} onChange={(e) => setEditTaskForm({...editTaskForm, priority: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Status</label>
                  <select value={editTaskForm.status} onChange={(e) => setEditTaskForm({...editTaskForm, status: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Progress (%)</label>
                <input type="number" value={editTaskForm.progress_percent} onChange={(e) => setEditTaskForm({...editTaskForm, progress_percent: parseInt(e.target.value) || 0})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} min="0" max="100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Start Date</label>
                  <input type="date" value={editTaskForm.start_date} onChange={(e) => setEditTaskForm({...editTaskForm, start_date: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Due Date</label>
                  <input type="date" value={editTaskForm.due_date} onChange={(e) => setEditTaskForm({...editTaskForm, due_date: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Expected Time (minutes)</label>
                  <input type="number" value={editTaskForm.expected_mins} onChange={(e) => setEditTaskForm({...editTaskForm, expected_mins: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} min="0" />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Realized Time (minutes)</label>
                  <input type="number" value={editTaskForm.realized_mins} onChange={(e) => setEditTaskForm({...editTaskForm, realized_mins: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} min="0" />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={handleUpdateTask} className={`flex-1 py-3 rounded-xl font-medium ${darkMode ? 'bg-black text-white hover:bg-zinc-800' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>Update Task</button>
                <button onClick={() => setShowEditTaskModal(false)} className={`flex-1 py-3 rounded-xl font-medium border-2 ${darkMode ? 'border-black text-black hover:bg-orange-400' : 'border-black text-black hover:bg-gray-100'}`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowEmployeeModal(false)}>
          <div className={`rounded-2xl p-8 border-2 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-orange-500 border-black' : 'bg-white border-black'}`} onClick={(e) => e.stopPropagation()}>
            <h2 className={`text-3xl font-light mb-6 ${darkMode ? 'text-black' : 'text-black'}`}>Create New Employee</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>First Name</label>
                  <input type="text" value={employeeForm.first_name} onChange={(e) => setEmployeeForm({...employeeForm, first_name: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Last Name</label>
                  <input type="text" value={employeeForm.last_name} onChange={(e) => setEmployeeForm({...employeeForm, last_name: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required />
                </div>
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Email</label>
                <input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} required />
              </div>
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Phone Number</label>
                <input type="tel" value={employeeForm.phone_number} onChange={(e) => setEmployeeForm({...employeeForm, phone_number: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Role</label>
                  <select value={employeeForm.role} onChange={(e) => setEmployeeForm({...employeeForm, role: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="Super-Admin">Super-Admin</option>
                    <option value="Super-Manager">Super-Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Trainer">Trainer</option>
                    <option value="Social Media Content Creator">Social Media Content Creator</option>
                    <option value="Project Manager">Project Manager</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Department</label>
                  <select value={employeeForm.department} onChange={(e) => setEmployeeForm({...employeeForm, department: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="Management">Management</option>
                    <option value="Project Management">Project Management</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Company</label>
                  <select value={employeeForm.company} onChange={(e) => setEmployeeForm({...employeeForm, company: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="L4Y">L4Y</option>
                    <option value="MAT">MAT</option>
                    <option value="ArtWN">ArtWN</option>
                    <option value="AAN">AAN</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Manager</label>
                  <select value={employeeForm.manager} onChange={(e) => setEmployeeForm({...employeeForm, manager: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="Ahmet Ateş">Ahmet Ateş</option>
                    <option value="Selin Selim">Selin Selim</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Employment Type</label>
                  <select value={employeeForm.employment_type} onChange={(e) => setEmployeeForm({...employeeForm, employment_type: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-black' : 'text-gray-700'}`}>Hire Date</label>
                  <input type="date" value={employeeForm.hire_date} onChange={(e) => setEmployeeForm({...employeeForm, hire_date: e.target.value})} className={`w-full px-4 py-3 rounded-xl border-2 ${darkMode ? 'bg-orange-400 border-black text-black' : 'bg-white border-black text-black'} focus:outline-none`} />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={handleCreateEmployee} className={`flex-1 py-3 rounded-xl font-medium ${darkMode ? 'bg-black text-white hover:bg-zinc-800' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>Create Employee</button>
                <button onClick={() => setShowEmployeeModal(false)} className={`flex-1 py-3 rounded-xl font-medium border-2 ${darkMode ? 'border-black text-black hover:bg-orange-400' : 'border-black text-black hover:bg-gray-100'}`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}