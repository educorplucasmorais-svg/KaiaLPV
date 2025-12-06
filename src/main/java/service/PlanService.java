package service;

import model.Plan;
import org.example.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    public Plan createPlan(Plan plan) {
        return planRepository.save(plan);
    }

    public Optional<Plan> getPlanById(Long id) {
        return planRepository.findById(id);
    }

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public List<Plan> getPlansByPatientId(Long patientId) {
        return planRepository.findByPatientId(patientId);
    }

    public Plan getPlanByCode(String planCode) {
        return planRepository.findByPlanCode(planCode);
    }

    public Plan updatePlan(Long id, Plan planData) {
        return planRepository.findById(id).map(plan -> {
            plan.setGoal(planData.getGoal());
            plan.setStatus(planData.getStatus());
            if (planData.getFileData() != null) {
                plan.setFileData(planData.getFileData());
                plan.setFileName(planData.getFileName());
            }
            return planRepository.save(plan);
        }).orElseThrow(() -> new RuntimeException("Plan not found"));
    }

    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }
}
