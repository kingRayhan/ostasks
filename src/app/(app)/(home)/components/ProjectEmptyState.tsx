import ProjectFormDrawer from "./ProjectFormDrawer";

const ProjectEmptyState = () => (
  <div className="text-center py-10">
    <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects</h3>
    <p className="mt-1 text-sm text-gray-500">
      Get started by creating a new project.
    </p>
    <div className="mt-6">
      {/* <ProjectFormDrawer
        onProjectCreate={() => alert("Project created")}
      ></ProjectFormDrawer> */}
    </div>
  </div>
);

export default ProjectEmptyState;
