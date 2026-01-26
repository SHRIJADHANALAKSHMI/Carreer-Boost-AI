import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search } from "lucide-react";
import { careerDomains, careerCategories, type CareerDomain } from "@/lib/careerDomains";
import { Input } from "@/components/ui/input";

interface UniversalRoleSelectorProps {
  selectedRole: string | null;
  onSelectRole: (roleId: string) => void;
}

const UniversalRoleSelector = ({ selectedRole, onSelectRole }: UniversalRoleSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState("tech");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDomains = searchQuery
    ? careerDomains.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : careerDomains.filter(d => d.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Select Your Target Career
        </h2>
        <p className="text-muted-foreground">
          Choose from 25+ career paths across tech, business, engineering & more
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search careers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary/50 border-border"
        />
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {careerCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Career grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery || activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredDomains.map((domain, index) => {
            const Icon = domain.icon;
            const isSelected = selectedRole === domain.id;
            
            return (
              <motion.button
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                onClick={() => onSelectRole(domain.id)}
                className={`relative p-5 rounded-xl text-left transition-all duration-300 ${
                  isSelected
                    ? "glass-card border-primary glow-primary"
                    : "glass-card-hover"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 truncate">{domain.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{domain.description}</p>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filteredDomains.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No careers found matching "{searchQuery}"
        </div>
      )}
    </motion.div>
  );
};

export default UniversalRoleSelector;
