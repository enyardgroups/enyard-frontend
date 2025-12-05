import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Users,
  Target,
  Rocket,
  CheckCircle,
  Loader2,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessApplicationService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { ContactMethod } from "@/types";
import { trackFormSubmit, trackButtonClick } from "@/utils/analytics";

interface BusinessFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const BusinessForm = ({ isOpen, onOpenChange }: BusinessFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    challenges: "",
    goals: "",
    timeline: "",
    budget: "",
    contactName: "",
    email: "",
    phone: "",
    preferredContact: "email" as ContactMethod,
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await businessApplicationService.createBusinessApplication({
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
        currentChallenges: formData.challenges,
        goalsObjectives: formData.goals,
        timeline: formData.timeline,
        budgetRange: formData.budget,
        fullName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        preferredContactMethod: formData.preferredContact,
      });
      // Track successful form submission
      trackFormSubmit("business_application", window.location.pathname, true, {
        companyName: formData.companyName,
        industry: formData.industry,
        companySize: formData.companySize,
      });
      toast({
        title: "Application Submitted",
        description: "Thank you! We will be in touch with you shortly.",
      });
      onOpenChange(false);
      setCurrentStep(1);
      setFormData({
        companyName: "",
        industry: "",
        companySize: "",
        challenges: "",
        goals: "",
        timeline: "",
        budget: "",
        contactName: "",
        email: "",
        phone: "",
        preferredContact: "email" as ContactMethod,
      });
    } catch (error: any) {
      // Track failed form submission
      trackFormSubmit("business_application", window.location.pathname, false, {
        error: error.message,
      });
      toast({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                Tell us about your company
              </h3>
              <p className="text-muted-foreground">
                Let's start with the basics
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  placeholder="Enter your company name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) =>
                    handleInputChange("industry", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="companySize">Company Size *</Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(value) =>
                    handleInputChange("companySize", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                What are your challenges?
              </h3>
              <p className="text-muted-foreground">
                Help us understand your needs
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="challenges">Current Challenges *</Label>
                <Textarea
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) =>
                    handleInputChange("challenges", e.target.value)
                  }
                  placeholder="Describe the main challenges your company is facing..."
                  className="mt-2 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="goals">Goals & Objectives *</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  placeholder="What do you want to achieve with our solutions?"
                  className="mt-2 min-h-[100px]"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Project Details</h3>
              <p className="text-muted-foreground">
                Let's plan your transformation
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="timeline">Timeline *</Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) =>
                    handleInputChange("timeline", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">
                      Immediate (0-3 months)
                    </SelectItem>
                    <SelectItem value="short">
                      Short term (3-6 months)
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium term (6-12 months)
                    </SelectItem>
                    <SelectItem value="long">Long term (12+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget">Budget Range *</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => handleInputChange("budget", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                    <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100k-500k">
                      $100,000 - $500,000
                    </SelectItem>
                    <SelectItem value="500k+">$500,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Contact Information</h3>
              <p className="text-muted-foreground">
                We'll get back to you soon
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="contactName">Full Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange("contactName", e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="preferredContact">
                  Preferred Contact Method
                </Label>
                <Select
                  value={formData.preferredContact}
                  onValueChange={(value) =>
                    handleInputChange("preferredContact", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold flex items-center justify-center">
            <Zap className="w-6 h-6 mr-2 text-primary" />
            Begin Your Transformation
          </DialogTitle>
          <p className="text-muted-foreground">
            Let's create your personalized transformation roadmap
          </p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(getStepProgress())}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="py-4">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center">
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Submit & Begin Transformation
              </Button>
            )}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index + 1 === currentStep
                  ? "bg-primary scale-125"
                  : index + 1 < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessForm;
