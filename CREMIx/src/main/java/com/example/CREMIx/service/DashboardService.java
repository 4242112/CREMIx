package com.example.CREMIx.service;

import com.example.CREMIx.dto.DashboardDTO;
import com.example.CREMIx.dto.GrowthDTO;

import java.util.List;

public interface DashboardService {
    DashboardDTO getDashboardData();
    GrowthDTO getGrowthData();
    List<DashboardDTO.ChartDataDTO> getLeadsBySource();
    List<DashboardDTO.ChartDataDTO> getProductsByCategory();
    List<DashboardDTO.ChartDataDTO> getOpportunitiesByStage();
}
