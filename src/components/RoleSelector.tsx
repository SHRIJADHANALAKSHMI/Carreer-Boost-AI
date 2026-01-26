import { motion } from "framer-motion";
import { Code2, Database, Layout } from "lucide-react";

export type RoleType = "frontend" | "backend" | "data-science";

interface RoleSelectorProps {
  selectedRole: RoleType | null;
  onSelectRole: (role: RoleType) => void;
}

const roles: { id: RoleType; title: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    icon: <Layout className="w-8 h-8" />,
    description: "React, TypeScript, CSS, UX/UI",
  },
  {
    id: "backend",
    title: "Backend Developer",
    icon: <Database className="w-8 h-8" />,
    description: "Node.js, Python, APIs, Databases",
  },
  {
    id: "data-science",
    title: "Data Scientist",
    icon: <Code2 className="w-8 h-8" />,
    description: "Python, ML, Statistics, Analytics",
  },
];

const RoleSelector = ({ selectedRole, onSelectRole }: RoleSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Select Your Target Role
        </h2>
        <p className="text-muted-foreground">
          Choose the role you're aiming for to get personalized insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role, index) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => onSelectRole(role.id)}
            className={`relative p-6 rounded-2xl text-left transition-all duration-300 ${
              selectedRole === role.id
                ? "glass-card border-primary glow-primary"
                : "glass-card-hover"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                selectedRole === role.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/20 text-primary"
              }`}
            >
              {role.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
            <p className="text-sm text-muted-foreground">{role.description}</p>

            {/* Selection indicator */}
            {selectedRole === role.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default RoleSelector;