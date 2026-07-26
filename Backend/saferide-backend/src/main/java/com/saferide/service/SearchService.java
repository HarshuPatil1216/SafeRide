package com.saferide.service;

import com.saferide.dto.SearchResultResponse;

import java.util.List;

public interface SearchService {

    List<SearchResultResponse> search(
            String query
    );
}