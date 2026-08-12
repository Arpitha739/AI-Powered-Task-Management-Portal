import { useEffect, useMemo, useRef,useState } from "react";
import api from "../services/api";

import { generateTaskWithAI }
from "../services/aiService";

import { Bell,CheckCircle2,Circle,Clock3,LayoutDashboard,ListTodo,LogOut,Menu,Plus,Search,Sparkles,X,
    ChevronDown,Pencil,Trash2
} from "lucide-react";


function Dashboard() {
    const hour = new Date().getHours();

let greeting;

if (hour < 12) {
    greeting = "Good morning";
} else if (hour < 18) {
    greeting = "Good afternoon";
} else {
    greeting = "Good evening";
}

    const tasksSectionRef = useRef(null);

    // TASK STATE
    const [tasks, setTasks] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // NEW / EDIT TASK MODAL
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [originalTaskStatus, setOriginalTaskStatus] =
        useState(null);

    const [taskForm, setTaskForm] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        status: "TODO",
        estimatedHours: ""
    });

    const [savingTask, setSavingTask] = useState(false);

    const [taskError, setTaskError] = useState("");

    // AI STATE

    const [showAiAssistant, setShowAiAssistant] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");
    const [aiResult, setAiResult] = useState(null);
    
    // DELETE STATE
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const username =
        localStorage.getItem("userName") || "User";

    // LOAD TASKS

    useEffect(() => {
        fetchTasks();
    }, []);

    // GET ALL TASKS
    const fetchTasks = async () => {

        try {
            const response =
                await api.get("/api/tasks");

            console.log(
                "Tasks received from backend:",
                response.data
            );

            if (Array.isArray(response.data)) {

                setTasks(response.data);
            } else {

                setTasks([]);
            }
        } catch (error) {
            console.error(
                "Unable to load tasks:",
                error
            );
            setTasks([]);
        }
    };

    // OPEN CREATE TASK MODAL
    const openCreateTaskModal = () => {
        setEditingTaskId(null);
        setOriginalTaskStatus(null);
        setTaskError("");
        setTaskForm({
            title: "",
            description: "",
            priority: "MEDIUM",
            dueDate: "",
            status: "TODO",
            estimatedHours: ""
        });

        setShowTaskModal(true);
    };

    // OPEN EDIT TASK MODAL

    const openEditTaskModal = (task) => {
        console.log(
            "Opening task for edit:",
            task
        );

        setEditingTaskId(task.id);

        setOriginalTaskStatus(
            task.status || "TODO"
        );
        setTaskError("");

        setTaskForm({
            title: task.title || "",

            description:
                task.description || "",

            priority:
                task.priority || "MEDIUM",

            dueDate:
                task.dueDate
                    ? String(task.dueDate).substring(0, 10)
                    : "",

            status:
                task.status || "TODO",

            estimatedHours:
                task.estimatedHours ??
                task.estimatedTime ??
                ""
        });

        setShowTaskModal(true);
    };

    // HANDLE FORM CHANGE

    const handleTaskFormChange = (e) => {

        const { name, value } = e.target;

        setTaskForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // CREATE / UPDATE TASK

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        setTaskError("");
  
        // TITLE VALIDATION

        if (!taskForm.title.trim()) {
            setTaskError(
                "Task title is required."
            );
            return;
        }

        // ESTIMATED HOURS VALIDATION
        if (taskForm.estimatedHours !== "") {
            const hours =
                Number(taskForm.estimatedHours);

            if (isNaN(hours) || hours <= 0) {

                setTaskError(
                    "Estimated hours must be greater than 0."
                );
                return;
            }
        }
        try {
            setSavingTask(true);

            // REQUEST DATA
            const requestData = {
                title:
                    taskForm.title.trim(),

                description:
                    taskForm.description.trim(),

                priority:
                    taskForm.priority,

                dueDate:
                    taskForm.dueDate || null,

                status:
                    taskForm.status,

                estimatedHours:
                    taskForm.estimatedHours === ""
                        ? null
                        : Number(
                            taskForm.estimatedHours
                        )
            };
            console.log(
                editingTaskId
                    ? "Updating task:"
                    : "Creating task:",
                requestData
            );

            // EDIT TASK

            if (editingTaskId) {

                // Update normal task information

                const response =
                    await api.put(
                        `/api/tasks/${editingTaskId}`,
                        requestData
                    );

                console.log(
                    "Task details updated:",
                    response.data
                );

                if (
                    originalTaskStatus !==
                    taskForm.status
                ) {
                    console.log(
                        "Status changed from",
                        originalTaskStatus,
                        "to",
                        taskForm.status
                    );
                    await api.patch(
                        `/api/tasks/${editingTaskId}/status`,
                        null,
                        {
                            params: {
                                status: taskForm.status
                            }
                        }
                    );
                   console.log(
                        "Status updated successfully through PATCH"
                    );
                }
            }

            // CREATE TASK
       
            else {
                const response =
                    await api.post(
                        "/api/tasks",
                        requestData
                    );
                console.log(
                    "Task created:",
                    response.data
                );
            }

            // RESET
  
            setTaskForm({
                title: "",
                description: "",
                priority: "MEDIUM",
                dueDate: "",
                status: "TODO",
                estimatedHours: ""
            });
            setEditingTaskId(null);
            setOriginalTaskStatus(null);
            setShowTaskModal(false);

            // RELOAD FROM DATABASE

            await fetchTasks();

        } catch (error) {
            console.error(
                "Task save error:",
                error
            );
            console.error(
                "Backend response:",
                error.response?.data
            );
            setTaskError(
                error.response?.data?.message ||
                (
                    editingTaskId
                        ? "Unable to update task. Please try again."
                        : "Unable to create task. Please try again."
                )
            );
        } finally {

            setSavingTask(false);

        }
    };

    // DELETE TASK

    const handleDeleteTask = async (taskId) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmed) {
            return;
        }
        try {
            setDeletingTaskId(taskId);
            console.log(
                "Deleting task:",
                taskId
            );
            await api.delete(
                `/api/tasks/${taskId}`
            );
            console.log(
                "Task deleted successfully"
            );
            await fetchTasks();
        } catch (error) {

            console.error(
                "Unable to delete task:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete task. Please try again."
            );
        } finally {
            setDeletingTaskId(null);
        }
    };

  // CHANGE STATUS]

    const handleStatusChange = async (
        taskId,
        newStatus
    ) => {

        try {

            console.log(
                "Changing task status:",
                taskId,
                newStatus
            );


            await api.patch(
                `/api/tasks/${taskId}/status`,
                null,
                {
                    params: {
                        status: newStatus
                    }
                }
            );


            console.log(
                "Task status updated successfully"
            );


            await fetchTasks();


        } catch (error) {

            console.error(
                "Unable to change task status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to change task status. Please try again."
            );
        }
    };

  // AI ASSISTANT

    const openAiAssistant = () => {

        setAiError("");

        setAiResult(null);

        setAiPrompt("");

        setShowAiAssistant(true);
    };

   // GENERATE TASK USING GEMINI

    const handleAiGenerate = async () => {

        if (!aiPrompt.trim()) {

            setAiError(
                "Please enter a task title or description."
            );

            return;
        }


        try {

            setAiLoading(true);

            setAiError("");

            setAiResult(null);


            console.log(
                "Sending AI request:",
                aiPrompt
            );


const response =
    await api.post(
        "/api/ai/generate",
        {
            title: aiPrompt.trim()
        }
    );


            console.log(
                "AI response:",
                response.data
            );


            setAiResult(response.data);


        } catch (error) {

            console.error(
                "Gemini AI error:",
                error
            );

            setAiError(
                error.response?.data?.message ||
                "Unable to generate task using AI."
            );

        } finally {

            setAiLoading(false);
        }
    };

  // USE AI RESULT AS TASK
 

    const useAiResult = () => {

        if (!aiResult) {
            return;
        }


        setTaskForm({

            title:
                aiResult.title ||
                aiPrompt,

            description:
                aiResult.description || "",

            priority:
                aiResult.priority || "MEDIUM",

            dueDate: "",

            status: "TODO",

            estimatedHours:
                aiResult.estimatedHours ??
                ""
        });


        setEditingTaskId(null);

        setOriginalTaskStatus(null);

        setShowAiAssistant(false);

        setShowTaskModal(true);
    };

  // STATISTICS
  
    const totalTasks =
        tasks.length;


    const todoTasks =
        tasks.filter(
            task => task.status === "TODO"
        ).length;


    const inProgressTasks =
        tasks.filter(
            task => task.status === "IN_PROGRESS"
        ).length;


    const completedTasks =
        tasks.filter(
            task => task.status === "DONE"
        ).length;


    const completionPercentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );

            // SEARCH + FILTER

    const filteredTasks = useMemo(() => {

        return tasks.filter(task => {

            const matchesSearch =
                task.title
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );


            const matchesStatus =
                statusFilter === "ALL" ||
                task.status === statusFilter;


            const matchesPriority =
                priorityFilter === "ALL" ||
                task.priority === priorityFilter;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        });

    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter
    ]);

    // LOGOUT

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("userName");

        window.location.href = "/login";
    };


    return (

        <div className="min-h-screen bg-slate-950 text-white">


            {/* MOBILE OVERLAY */}

            {sidebarOpen && (

                <div
                    className="
                        fixed inset-0 z-30
                        bg-black/60 lg:hidden
                    "
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />

            )}


            {/*  SIDEBAR */}

            <aside
                className={`
                    fixed left-0 top-0 z-40
                    h-screen w-72
                    border-r border-white/10
                    bg-slate-950
                    transition-transform duration-300
                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                    lg:translate-x-0
                `}
            >

                <div className="flex h-full flex-col">


                    {/* Logo */}

                    <div className="
                        flex items-center gap-3
                        px-6 py-7
                    ">

                        <div className="
                            flex h-11 w-11
                            items-center justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-violet-500 to-cyan-400
                            shadow-lg
                            shadow-violet-500/20
                        ">
                            <Sparkles size={22} />
                        </div>

                        <div>

                            <h1 className="
                                text-xl font-bold
                                tracking-tight
                            ">
                                TaskPilot
                            </h1>

                            <p className="
                                text-xs text-slate-500
                            ">
                                AI Task Management
                            </p>

                        </div>

                        <button
                            className="ml-auto lg:hidden"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                        >
                            <X size={20} />
                        </button>

                    </div>


                    {/* Navigation */}

                    <nav className="flex-1 px-4 py-5">

                        <p className="
                            px-3 pb-3
                            text-xs font-semibold
                            uppercase tracking-widest
                            text-slate-500
                        ">
                            Workspace
                        </p>


                        <button className="
                            flex w-full items-center
                            gap-3 rounded-xl
                            bg-violet-500/15
                            px-4 py-3
                            text-sm font-medium
                            text-violet-300
                        ">
                            <LayoutDashboard size={19} />
                            Dashboard
                        </button>


<button
    onClick={() => {
        setShowAiAssistant(false);

        tasksSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }}
    className="
        mt-2 flex w-full
        items-center gap-3
        rounded-xl px-4 py-3
        text-sm text-slate-400
        transition
        hover:bg-white/5
        hover:text-white
    "
>
    <ListTodo size={19} />
    My Tasks
</button>


                        <button
                            onClick={openAiAssistant}
                            className="
                                mt-2 flex w-full
                                items-center gap-3
                                rounded-xl px-4 py-3
                                text-sm text-slate-400
                                transition
                                hover:bg-white/5
                                hover:text-white
                            "
                        >
                            <Sparkles size={19} />
                            AI Assistant
                        </button>

                    </nav>


                    {/* Bottom */}

                    <div className="
                        border-t border-white/10 p-4
                    ">

                        <div className="
                            mb-3 rounded-2xl
                            bg-gradient-to-br
                            from-violet-500/10
                            to-cyan-500/10
                            p-4
                        ">

                            <div className="
                                mb-2 flex items-center gap-2
                            ">

                                <Sparkles
                                    size={17}
                                    className="
                                        text-violet-400
                                    "
                                />

                                <span className="
                                    text-sm font-semibold
                                ">
                                    AI Powered
                                </span>

                            </div>

                            <p className="
                                text-xs leading-5
                                text-slate-500
                            ">
                                Let AI create descriptions,
                                priorities and effort estimates.
                            </p>

                        </div>


                        <button
                            onClick={handleLogout}
                            className="
                                flex w-full
                                items-center gap-3
                                rounded-xl px-4 py-3
                                text-sm text-slate-400
                                transition
                                hover:bg-red-500/10
                                hover:text-red-400
                            "
                        >
                            <LogOut size={18} />
                            Logout
                        </button>

                    </div>

                </div>

            </aside>


            {/*   MAIN */}

            <main className="lg:ml-72">


                {/* Header */}

                <header className="
                    sticky top-0 z-20
                    border-b border-white/10
                    bg-slate-950/80
                    px-5 py-4
                    backdrop-blur-xl
                    sm:px-8
                ">

                    <div className="
                        flex items-center
                        justify-between
                    ">

                        <button
                            className="lg:hidden"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                        >
                            <Menu size={22} />
                        </button>


                        <div className="hidden lg:block" />


                        <div className="
                            flex items-center gap-4
                        ">

                            <button className="
                                relative rounded-xl p-2.5
                                text-slate-400
                                hover:bg-white/5
                                hover:text-white
                            ">

                                <Bell size={19} />

                                <span className="
                                    absolute right-2 top-2
                                    h-1.5 w-1.5
                                    rounded-full
                                    bg-violet-400
                                " />

                            </button>


                            <div className="
                                flex items-center gap-3
                                border-l border-white/10
                                pl-4
                            ">

                                <div className="
                                    flex h-9 w-9
                                    items-center justify-center
                                    rounded-full
                                    bg-gradient-to-br
                                    from-violet-500
                                    to-cyan-400
                                    text-sm font-bold
                                ">
                                    {username
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>


                                <div className="
                                    hidden sm:block
                                ">

                                    <p className="
                                        text-sm font-medium
                                    ">
                                        {username}
                                    </p>

                                    <p className="
                                        text-xs text-slate-500
                                    ">
                                        Developer
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </header>


                {/*  CONTENT*/}

                <section className="
                    px-5 py-8
                    sm:px-8
                    lg:px-10
                ">


                    {/* Welcome */}

                    <div className="mb-8">

                        <p className="
                            mb-2 text-sm font-medium
                            text-violet-400
                        ">
                            YOUR WORKSPACE
                        </p>

                        <h2 className="
                            text-3xl font-bold
                            tracking-tight
                            sm:text-4xl
                        ">
                           {greeting}, {username || User} 👋
                        </h2>

                        <p className="
                            mt-2 text-slate-400
                        ">
                            Stay focused. Turn today's
                            tasks into progress.
                        </p>

                    </div>


                    {/* STATISTICS */}

                    <div className="
                        grid gap-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    ">

                        <StatCard
                            title="Total Tasks"
                            value={totalTasks}
                            icon={
                                <ListTodo size={20} />
                            }
                            description="All your tasks"
                        />

                        <StatCard
                            title="To Do"
                            value={todoTasks}
                            icon={
                                <Circle size={20} />
                            }
                            description="Waiting to start"
                        />

                        <StatCard
                            title="In Progress"
                            value={inProgressTasks}
                            icon={
                                <Clock3 size={20} />
                            }
                            description="Currently active"
                        />

                        <StatCard
                            title="Completed"
                            value={completedTasks}
                            icon={
                                <CheckCircle2 size={20} />
                            }
                            description={
                                `${completionPercentage}% completion`
                            }
                        />
                    </div>

                    {/*  AI BANNER */}

                    <div className="
                        relative mt-6 overflow-hidden
                        rounded-3xl
                        border border-violet-400/20
                        bg-gradient-to-r
                        from-violet-600/20
                        via-slate-900
                        to-cyan-500/10
                        p-6
                    ">

                        <div className="
                            absolute -right-20 -top-20
                            h-48 w-48 rounded-full
                            bg-violet-500/10
                            blur-3xl
                        " />


                        <div className="
                            relative flex flex-col
                            gap-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        ">

                            <div className="flex gap-4">

                                <div className="
                                    flex h-12 w-12
                                    shrink-0
                                    items-center justify-center
                                    rounded-2xl
                                    bg-violet-500/20
                                    text-violet-300
                                ">
                                    <Sparkles size={23} />
                                </div>


                                <div>

                                    <p className="
                                        mb-1 text-xs
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-violet-400
                                    ">
                                        AI Assistant
                                    </p>

                                    <h3 className="
                                        text-lg font-semibold
                                    ">
                                        Create smarter tasks with Gemini
                                    </h3>

                                    <p className="
                                        mt-1 max-w-xl
                                        text-sm text-slate-400
                                    ">
                                        Enter a simple task title
                                        and let AI generate the
                                        description, priority and
                                        estimated effort.
                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={openAiAssistant}
                                className="
                                    flex shrink-0
                                    items-center
                                    justify-center
                                    gap-2 rounded-xl
                                    bg-white px-5 py-3
                                    text-sm font-semibold
                                    text-slate-950
                                    transition
                                    hover:scale-[1.02]
                                    hover:bg-violet-100
                                "
                            >
                                <Sparkles size={17} />
                                Open AI Assistant
                            </button>
                        </div>
                    </div>

                    {/*   TASK SECTION */}

                  <div
    ref={tasksSectionRef}
    className="mt-10 scroll-mt-24"
>

                        <div className="
                            mb-5 flex flex-col gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        ">

                            <div>

                                <h3 className="
                                    text-xl font-bold
                                ">
                                    My Tasks
                                </h3>

                                <p className="
                                    mt-1 text-sm text-slate-500
                                ">
                                    Manage everything you
                                    need to accomplish.
                                </p>

                            </div>


                            <button
                                onClick={openCreateTaskModal}
                                className="
                                    flex items-center
                                    justify-center gap-2
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-violet-600
                                    to-indigo-600
                                    px-5 py-3
                                    text-sm font-semibold
                                    shadow-lg
                                    shadow-violet-600/20
                                    transition
                                    hover:-translate-y-0.5
                                "
                            >
                                <Plus size={18} />
                                New Task
                            </button>

                        </div>


                        {/* Search / Filters */}

                        <div className="
                            mb-5 flex flex-col gap-3
                            lg:flex-row
                        ">

                            <div className="
                                relative flex-1
                            ">

                                <Search
                                    size={18}
                                    className="
                                        absolute left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-500
                                    "
                                />

                                <input
                                    value={search}
                                    onChange={e =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="
                                        Search your tasks...
                                    "
                                    className="
                                        w-full rounded-xl
                                        border border-white/10
                                        bg-white/[0.03]
                                        py-3 pl-11 pr-4
                                        text-sm text-white
                                        outline-none
                                        placeholder:text-slate-600
                                        focus:border-violet-500/50
                                    "
                                />

                            </div>


                            <FilterSelect
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    ["ALL", "All Status"],
                                    ["TODO", "To Do"],
                                    [
                                        "IN_PROGRESS",
                                        "In Progress"
                                    ],
                                    [
                                        "DONE",
                                        "Completed"
                                    ]
                                ]}
                            />

                            <FilterSelect
                                value={priorityFilter}
                                onChange={setPriorityFilter}
                                options={[
                                    ["ALL", "All Priority"],
                                    ["LOW", "Low"],
                                    ["MEDIUM", "Medium"],
                                    ["HIGH", "High"]
                                ]}
                            />
                        </div>

                        {/*  TASK LIST*/}

                        <div className="space-y-3">

                            {filteredTasks.length === 0 ? (

                                <div className="
                                    rounded-3xl
                                    border border-dashed
                                    border-white/10
                                    bg-white/[0.02]
                                    px-6 py-16
                                    text-center
                                ">

                                    <div className="
                                        mx-auto mb-4
                                        flex h-14 w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-white/5
                                    ">
                                        <ListTodo
                                            size={25}
                                            className="
                                                text-slate-500
                                            "
                                        />
                                    </div>

                                    <h4 className="font-semibold">
                                        No tasks found
                                    </h4>

                                    <p className="
                                        mx-auto mt-2
                                        max-w-sm
                                        text-sm text-slate-500
                                    ">
                                        Create your first task
                                        or change your search
                                        and filters.
                                    </p>
                                </div>
                            ) : (
                                filteredTasks.map(task => (

                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={
                                            openEditTaskModal
                                        }
                                        onDelete={
                                            handleDeleteTask
                                        }
                                        onStatusChange={
                                            handleStatusChange
                                        }
                                        deletingTaskId={
                                            deletingTaskId
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/*   AI ASSISTANT MODAL */}

            {showAiAssistant && (

                <div className="
                    fixed inset-0 z-50
                    flex items-center justify-center
                    bg-black/70
                    px-4
                    backdrop-blur-sm
                ">

                    <div className="
                        w-full max-w-xl
                        max-h-[90vh]
                        overflow-y-auto
                        rounded-3xl
                        border border-white/10
                        bg-slate-900
                        shadow-2xl
                    ">

                        {/* Header */}

                        <div className="
                            flex items-center
                            justify-between
                            border-b border-white/10
                            px-6 py-5
                        ">

                            <div className="
                                flex items-center gap-3
                            ">
                                <div className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-xl
                                    bg-violet-500/15
                                    text-violet-400
                                ">
                                    <Sparkles size={20} />
                                </div>

                                <div>
                                    <h3 className="
                                        text-lg font-semibold
                                    ">
                                        Gemini AI Assistant
                                    </h3>

                                    <p className="
                                        text-xs text-slate-500
                                    ">
                                        Generate a smarter task
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() =>
                                    setShowAiAssistant(false)
                                }
                                className="
                                    rounded-xl p-2
                                    text-slate-400
                                    hover:bg-white/5
                                    hover:text-white
                                "
                            >
                                <X size={20} />
                            </button>

                        </div>
                        <div className="p-6">

                            <label className="
                                mb-2 block
                                text-sm font-medium
                                text-slate-300
                            ">
                                What task do you want to create?
                            </label>

                            <textarea
                                value={aiPrompt}
                                onChange={e =>
                                    setAiPrompt(
                                        e.target.value
                                    )
                                }
                                rows="4"
                                placeholder="
                                    Example: Prepare a presentation
                                    for the client meeting next week
                                "
                                className="
                                    w-full resize-none
                                    rounded-xl
                                    border border-white/10
                                    bg-white/[0.03]
                                    px-4 py-3
                                    text-sm text-white
                                    outline-none
                                    placeholder:text-slate-600
                                    focus:border-violet-500/50
                                "
                            />
                            {aiError && (

                                <div className="
                                    mt-4 rounded-xl
                                    border border-red-500/20
                                    bg-red-500/10
                                    px-4 py-3
                                    text-sm text-red-300
                                ">
                                    {aiError}
                                </div>
                            )}
                            <button
                                onClick={handleAiGenerate}
                                disabled={aiLoading}
                                className="
                                    mt-4 flex w-full
                                    items-center
                                    justify-center gap-2
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-violet-600
                                    to-indigo-600
                                    px-5 py-3
                                    text-sm font-semibold
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Sparkles size={17} />
                                {aiLoading
                                    ? "Generating..."
                                    : "Generate Task with Gemini"
                                }
                            </button>

                            {/* AI RESULT */}

                            {aiResult && (

                                <div className="
                                    mt-6 rounded-2xl
                                    border border-violet-500/20
                                    bg-violet-500/5
                                    p-5
                                ">

                                    <p className="
                                        mb-3 text-xs
                                        font-semibold
                                        uppercase
                                        tracking-widest
                                        text-violet-400
                                    ">
                                        AI Generated Task
                                    </p>


                                    <h4 className="
                                        text-lg font-semibold
                                    ">
                                        {aiResult.title}
                                    </h4>


                                    <p className="
                                        mt-2 text-sm
                                        leading-6
                                        text-slate-400
                                    ">
                                        {aiResult.description}
                                    </p>


                                    <div className="
                                        mt-4 flex flex-wrap
                                        gap-2
                                    ">

                                        <span className="
                                            rounded-full
                                            border
                                            border-amber-400/20
                                            bg-amber-400/10
                                            px-3 py-1
                                            text-xs
                                            text-amber-300
                                        ">
                                            Priority: {
                                                aiResult.priority
                                            }
                                        </span>

                                        <span className="
                                            rounded-full
                                            border
                                            border-blue-400/20
                                            bg-blue-400/10
                                            px-3 py-1
                                            text-xs
                                            text-blue-300
                                        ">
                                            Estimated: {
                                                aiResult.estimatedHours
                                            } hours
                                        </span>
                                    </div>

                                    <button
                                        onClick={useAiResult}
                                        className="
                                            mt-5 w-full
                                            rounded-xl
                                            bg-white
                                            px-5 py-3
                                            text-sm font-semibold
                                            text-slate-950
                                            transition
                                            hover:bg-violet-100
                                        "
                                    >
                                        Use This Task
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/*  CREATE / EDIT TASK MODAL */}

            {showTaskModal && (

                <div className="
                    fixed inset-0 z-50
                    flex items-center justify-center
                    bg-black/70
                    px-4
                    backdrop-blur-sm
                ">

                    <div className="
                        w-full max-w-xl
                        max-h-[90vh]
                        overflow-y-auto
                        rounded-3xl
                        border border-white/10
                        bg-slate-900
                        shadow-2xl
                    ">


                        {/* Modal Header */}

                        <div className="
                            flex items-center
                            justify-between
                            border-b border-white/10
                            px-6 py-5
                        ">

                            <div className="
                                flex items-center gap-3
                            ">

                                <div className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-xl
                                    bg-violet-500/15
                                    text-violet-400
                                ">
                                    {editingTaskId
                                        ? <Pencil size={19} />
                                        : <Plus size={20} />
                                    }
                                </div>

                                <div>

                                    <h3 className="
                                        text-lg font-semibold
                                    ">
                                        {editingTaskId
                                            ? "Edit Task"
                                            : "Create New Task"
                                        }
                                    </h3>

                                    <p className="
                                        text-xs text-slate-500
                                    ">
                                        {editingTaskId
                                            ? "Update your task details"
                                            : "Add a task to your workspace"
                                        }
                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={() => {

                                    setShowTaskModal(false);

                                    setEditingTaskId(null);

                                    setOriginalTaskStatus(null);
                                }}
                                className="
                                    rounded-xl p-2
                                    text-slate-400
                                    hover:bg-white/5
                                    hover:text-white
                                "
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={handleTaskSubmit}
                            className="p-6"
                        >

                            {/* Error */}

                            {taskError && (

                                <div className="
                                    mb-5 rounded-xl
                                    border border-red-500/20
                                    bg-red-500/10
                                    px-4 py-3
                                    text-sm text-red-300
                                ">
                                    {taskError}
                                </div>

                            )}


                            {/* Title */}

                            <div className="mb-5">

                                <label className="
                                    mb-2 block
                                    text-sm font-medium
                                    text-slate-300
                                ">
                                    Task Title
                                    <span className="
                                        text-red-400
                                    ">
                                        {" "}*
                                    </span>
                                </label>

                                <input
                                    name="title"
                                    value={taskForm.title}
                                    onChange={
                                        handleTaskFormChange
                                    }
                                    placeholder="
                                        e.g. Prepare client presentation
                                    "
                                    className="
                                        w-full rounded-xl
                                        border border-white/10
                                        bg-white/[0.03]
                                        px-4 py-3
                                        text-sm text-white
                                        outline-none
                                        placeholder:text-slate-600
                                        focus:border-violet-500/50
                                    "
                                />

                            </div>


                            {/* Description */}

                            <div className="mb-5">

                                <label className="
                                    mb-2 block
                                    text-sm font-medium
                                    text-slate-300
                                ">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        taskForm.description
                                    }
                                    onChange={
                                        handleTaskFormChange
                                    }
                                    rows="4"
                                    placeholder="
                                        Describe what needs to be accomplished...
                                    "
                                    className="
                                        w-full resize-none
                                        rounded-xl
                                        border border-white/10
                                        bg-white/[0.03]
                                        px-4 py-3
                                        text-sm text-white
                                        outline-none
                                        placeholder:text-slate-600
                                        focus:border-violet-500/50
                                    "
                                />

                            </div>


                            {/* Priority + Status */}

                            <div className="
                                mb-5 grid gap-4
                                sm:grid-cols-2
                            ">

                                <div>

                                    <label className="
                                        mb-2 block
                                        text-sm font-medium
                                        text-slate-300
                                    ">
                                        Priority
                                    </label>

                                    <select
                                        name="priority"
                                        value={
                                            taskForm.priority
                                        }
                                        onChange={
                                            handleTaskFormChange
                                        }
                                        className="
                                            w-full rounded-xl
                                            border border-white/10
                                            bg-slate-900
                                            px-4 py-3
                                            text-sm text-slate-300
                                            outline-none
                                            focus:border-violet-500/50
                                        "
                                    >

                                        <option value="LOW">
                                            Low
                                        </option>

                                        <option value="MEDIUM">
                                            Medium
                                        </option>

                                        <option value="HIGH">
                                            High
                                        </option>

                                    </select>

                                </div>


                                <div>

                                    <label className="
                                        mb-2 block
                                        text-sm font-medium
                                        text-slate-300
                                    ">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            taskForm.status
                                        }
                                        onChange={
                                            handleTaskFormChange
                                        }
                                        className="
                                            w-full rounded-xl
                                            border border-white/10
                                            bg-slate-900
                                            px-4 py-3
                                            text-sm text-slate-300
                                            outline-none
                                            focus:border-violet-500/50
                                        "
                                    >

                                        <option value="TODO"> To Do</option>

                                        <option value="IN_PROGRESS">
                                            In Progress
                                        </option>

                                        <option value="DONE">
                                            Completed
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* Due Date + Estimated Hours */}

                            <div className="
                                mb-6 grid gap-4
                                sm:grid-cols-2
                            ">

                                <div>

                                    <label className="
                                        mb-2 block
                                        text-sm font-medium
                                        text-slate-300
                                    ">
                                        Due Date
                                    </label>

                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={
                                            taskForm.dueDate
                                        }
                                        onChange={
                                            handleTaskFormChange
                                        }
                                        className="
                                            w-full rounded-xl
                                            border border-white/10
                                            bg-white/[0.03]
                                            px-4 py-3
                                            text-sm text-slate-300
                                            outline-none
                                            focus:border-violet-500/50
                                        "
                                    />

                                </div>


                                <div>

                                    <label className="
                                        mb-2 block
                                        text-sm font-medium
                                        text-slate-300
                                    ">
                                        Estimated Time
                                    </label>

                                    <div className="
                                        relative
                                    ">

                                        <input
                                            type="number"
                                            name="estimatedHours"
                                            value={
                                                taskForm
                                                    .estimatedHours
                                            }
                                            onChange={
                                                handleTaskFormChange
                                            }
                                            min="0.5"
                                            step="0.5"
                                            placeholder="
                                                e.g. 4
                                            "
                                            className="
                                                w-full rounded-xl
                                                border border-white/10
                                                bg-white/[0.03]
                                                px-4 py-3 pr-14
                                                text-sm text-white
                                                outline-none
                                                placeholder:text-slate-600
                                                focus:border-violet-500/50
                                            "
                                        />

                                        <span className="
                                            pointer-events-none
                                            absolute right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-xs text-slate-500
                                        ">
                                            hours
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* Buttons */}

                            <div className="
                                flex flex-col-reverse
                                gap-3
                                sm:flex-row
                                sm:justify-end
                            ">

                                <button
                                    type="button"
                                    onClick={() => {

                                        setShowTaskModal(false);

                                        setEditingTaskId(null);

                                        setOriginalTaskStatus(null);
                                    }}
                                    className="
                                        rounded-xl
                                        border border-white/10
                                        px-5 py-3
                                        text-sm font-medium
                                        text-slate-400
                                        transition
                                        hover:bg-white/5
                                        hover:text-white
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={savingTask}
                                    className=" rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600  px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-600/20 transition
                                        hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 " >
                                    {savingTask
                                        ? (
                                            editingTaskId
                                                ? "Updating..."
                                                : "Creating..."
                                        )
                                        : (
                                            editingTaskId
                                                ? "Update Task"
                                                : "Create Task"
                                        )
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// STATISTIC CARD

function StatCard({
    title, value, icon,description}) {

    return (
        <div className="  rounded-2xl border border-white/10 bg-white/[0.03] p-5   transition
            hover:-translate-y-1  hover:border-violet-500/20 ">

            <div className="  flex items-start justify-between  ">
                <div>
                    <p className="text-sm text-slate-500 "> {title} </p>
                    <p className=" mt-2 text-3xl font-bold ">  {value}  </p>
                </div>

                <div className=" rounded-xl bg-violet-500/10 p-3 text-violet-400 ">
                    {icon}
                </div>
            </div>
            <p className="  mt-4 text-xs text-slate-500  "> {description} </p>
        </div>
    );
}

// FILTER

function FilterSelect({
    value, onChange, options
}) {

    return (

        <div className="relative">
            <select
                value={value}
                onChange={e =>
                    onChange(e.target.value)
                }
                className=" w-full appearance-none
                    rounded-xl border border-white/10 bg-white/[0.03]
                    px-4 py-3 pr-10 text-sm text-slate-300
                    outline-none focus:border-violet-500/50 lg:w-44 "  >

                {options.map(
                    ([optionValue, label]) => (

                        <option
                            key={optionValue}
                            value={optionValue}
                            className="bg-slate-900"
                        >
                            {label}
                        </option>

                    )
                )}

            </select>


            <ChevronDown
                size={16}
                className="
                    pointer-events-none
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-slate-500
                "
            />

        </div>
    );
}

// TASK CARD

function TaskCard({
    task,
    onEdit,
    onDelete,
    onStatusChange,
    deletingTaskId
}) {

    const priorityStyle = {

        HIGH:
            "border-red-400/20 bg-red-400/10 text-red-300",
        MEDIUM:
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
        LOW:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    };
    const statusStyle = {
        TODO:
            "text-slate-400",
        IN_PROGRESS:
            "text-blue-400",
        DONE:
            "text-emerald-400"
    };
    const estimatedTime =
        task.estimatedHours ??
        task.estimatedTime;

    const isDeleting =
        deletingTaskId === task.id;

    return (
        <div className="  group rounded-2xl border border-white/10
            bg-white/[0.025]    p-5    transition hover:border-violet-500/20 hover:bg-white/[0.04]  ">

            <div className="  flex flex-col gap-4  sm:flex-row
                sm:items-start sm:justify-between ">

                <div className="  min-w-0 flex-1 ">
                    <div className="  mb-2 flex flex-wrap items-center gap-2  ">
                        <h4 className=" truncate text-base font-semibold text-white  ">
                            {task.title}
                        </h4>
                        {task.priority && (
                            <span className={` rounded-full border px-2.5 py-1
                                text-[11px] font-semibold
                                ${
                                    priorityStyle[
                                        task.priority
                                    ] || ""
                                }
                            `}>
                                {task.priority}
                            </span>
                        )}
                    </div>
                    <p className=" line-clamp-2 text-sm leading-6 text-slate-500  ">
                        {task.description ||
                            "No description provided."}
                    </p>
                </div>

                {/* STATUS + ACTIONS */}

                <div className=" flex shrink-0  items-center gap-2  ">
                    {/* Status */}

                    <div className=" relative   ">
                        <select
                            value={
                                task.status || "TODO"
                            }
                            onChange={e =>
                                onStatusChange(task.id, e.target.value )
                            }
                            className={`
                                appearance-none cursor-pointer rounded-lg
                                border border-white/10 bg-white/[0.03] py-2 pl-3 pr-8
                                text-xs font-semibold outline-none focus:border-violet-500/50
                                ${
                                    statusStyle[
                                        task.status
                                    ] || ""
                                }
                            `}
                            title="Change status"
                        >
                            <option value="TODO" className="bg-slate-900 "  >  To Do </option>

                            <option value="IN_PROGRESS" className=" bg-slate-900  "  >In Progress </option>

                            <option
                                value="DONE"
                                className=" bg-slate-900  "
                            >
                                Completed
                            </option>
                        </select>

                        <ChevronDown
                            size={13}
                            className=" pointer-events-none
                                absolute right-2  top-1/2
                                -translate-y-1/2   text-slate-500 "
                        />
                    </div>

                    {/* Edit */}

                    <button
                        onClick={() =>
                            onEdit(task)
                        }
                        className="
                            rounded-lg p-2  text-slate-500
                            transition hover:bg-violet-500/10
                            hover:text-violet-400   "
                        title="Edit task"
                    >
                        <Pencil size={16} />
                    </button>

                    {/* Delete */}

                    <button
                        onClick={() =>
                            onDelete(task.id)
                        }
                        disabled={isDeleting}
                        className="  rounded-lg p-2 text-slate-500 transition
                            hover:bg-red-500/10 hover:text-red-400  disabled:cursor-not-allowed
                            disabled:opacity-50  "
                        title="Delete task"
                    >
                        <Trash2 size={16} />
                    </button>
             </div>
            </div>

            {/* TASK METADATA */}

            <div className=" mt-5 flex flex-wrap items-center gap-4
                border-t border-white/5 pt-4 text-xs text-slate-500
            ">
                {task.dueDate && (
                    <span>
                        📅 Due {task.dueDate}
                    </span>
                )}
                {estimatedTime != null && (
                    <span>
                        ⏱ {estimatedTime} hours
                    </span>
                )}
                {task.createdAt && (
                    <span>
                        Created {
                            new Date(
                                task.createdAt
                            ).toLocaleDateString()
                        }
                    </span>
                )}
                <span className="
                    ml-auto
                ">
                    #{task.id}
                </span>
            </div>
        </div>
    );
}

export default Dashboard;